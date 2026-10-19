const express=require("express");//to create the router and handle HTTP requests
const bcrypt=require("bcrypt");//lib to hash passwords before storing in database
const jwt=require("jsonwebtoken");//
const multer=require('multer');
const path=require('path');
const upload = multer({ dest: 'uploads/' }); 
const authenticateUser = require("../middleware/authMiddleware");
const secretKey="secretkey123";
const router=express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); 
        cb(null, Date.now() + ext); 
    }
});


module.exports=(pool)=>{ 
router.post("/signup",async (req,res)=>{
    const {email,password}=req.body;

    try{
        const userExists=await pool.query(
            'SELECT*FROM Users WHERE Email=$1',
            [email]
        );
        if(userExists.rows.length>0){
            return res.status(400).json({message:"User already exists"});
        }
    

    const hashedPassword=await bcrypt.hash(password,10);


    await pool.query(
        'INSERT INTO Users (Email,Password) VALUES ($1,$2)',
        [email,hashedPassword]
    );

    res.status(201).json({message:"User registered successfully"});
}
catch(err){
    console.error(err);
    res.status(500).json({message:"Server error"});
}
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    try {
        const userResult = await pool.query(
            'SELECT * FROM Users WHERE Email = $1',
            [email]
        );

        console.log("User result from DB:", userResult.rows[0]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        console.log('Entered password:', password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        
        const token = jwt.sign({ ID: user.id, email: user.email }, 'secretkey123', { expiresIn: '1h' });
        console.log("Sending response with token and ID:", { token, ID: user.id });
       
        res.status(200).json({ 
            message: "Login successful", 
            token, 
            id: user.id 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/admin-login", async (req, res) => {
    const { passkey } = req.body;

    console.log("Received passkey:", passkey);

    try {
    
        const adminResult = await pool.query(
            'SELECT * FROM Users WHERE Role = $1',
            ['admin']
        );

 
        console.log("Admin query result:", adminResult.rows);

        if (adminResult.rows.length === 0) {
            return res.status(401).json({ message: "Admin not found" });
        }

        const admin = adminResult.rows[0];

        
        console.log("Retrieved admin object:", admin);

        const isMatch = passkey === admin.password; 
        console.log("Passkey match result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Passkey" });
        }

        
        res.status(200).json({ message: "Admin Login Successful", admin });
    } catch (err) {
        console.error("Error during admin login:", err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/cards", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                c.c_id,
                c.first_name,
                c.last_name,
                c.pr_sp,
                c.gender,
                c.age,
                c.prev_exp,
                c.availability,
                c.status,
                c.profile_image,
                c.emp_type,
                p.specialization_name,
                l.language_spoken
            FROM caretaker c
            LEFT JOIN provides p ON c.c_id = p.c_id
            LEFT JOIN language l ON c.c_id = l.c_id
            WHERE c.status = $1
        `, ['approved']);

        // Group the data by c_id
        const caretakers = {};

        result.rows.forEach(row => {
            const id = row.c_id;
            if (!caretakers[id]) {
                caretakers[id] = {
                    c_id: id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    pr_sp: row.pr_sp,
                    gender: row.gender,
                    age: row.age,
                    prev_exp: row.prev_exp,
                    availability: row.availability,
                    status: row.status,
                    profile_image: row.profile_image,
                    emp_type: row.emp_type,
                    additional_specializations: new Set(),
                    languages: new Set()
                };
            }

        
            if (row.specialization_name && row.specialization_name !== row.pr_sp) {
                caretakers[id].additional_specializations.add(row.specialization_name);
            }

           
            if (row.language_spoken) {
                caretakers[id].languages.add(row.language_spoken);
            }
        });

        
        const finalData = Object.values(caretakers).map(ct => ({
            ...ct,
            additional_specializations: Array.from(ct.additional_specializations),
            languages: Array.from(ct.languages)
        }));

        res.status(200).json(finalData);

    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/register-caretaker",upload.single('profilePhoto'),async (req, res) => {
    console.log("Received caretaker registration data:", req.body);
    let {
        FirstName,
        LastName,
        dob,
        gender,
        phone,
        email,
        permanentAddress,
        experience,
        expectedSalary,
        additional_skills,
        emp_type, 
        specialization,
        hours_per_day,

        languages,
       
    } = req.body;
   


    console.log("Received caretaker registration data:", req.body);
    let profilePhoto = req.file ? req.file.path : null;
    const client = await pool.connect();

    try {
        console.log("Starting transaction...");
        await client.query("BEGIN");

        console.log("Inserting into caretaker table...");
        const caretakerRes = await client.query(
            `INSERT INTO caretaker (
                first_name, last_name, phone_number, email_address, permanent_address,
                prev_exp, expected_salary, emp_type, pr_sp,
                gender, age,profile_image
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, calculate_age($11::DATE),$12)
            RETURNING c_id`, 
            [
                FirstName, 
                LastName,  
                phone, 
                email, 
                permanentAddress, 
                experience, 
                expectedSalary, 
                emp_type, 
                specialization,
                gender, 
                dob,
                profilePhoto
            
            ]
        );
       


        const caretakerId = caretakerRes.rows[0].c_id;
        console.log("Caretaker inserted with ID:", caretakerId);
        if(emp_type=="Part-time"){
            console.log("Inserting into Part Time table");
            await client.query(
                 `INSERT INTO Part_Time (c_id, max_Hours_Per_Day) VALUES ($1, $2)`,
                 [caretakerId,hours_per_day]
            );
        }

try {
   
    if (typeof additional_skills === 'string') {
        additional_skills = JSON.parse(additional_skills);
    }

    if (typeof languages === 'string') {
        languages = JSON.parse(languages);
    }
} catch (err) {
    console.error("Error parsing array fields:", err.message);
    additional_skills = [];
    languages = [];
}


if (languages && languages.length) {
    console.log("Inserting languages...");
    for (const lang of languages) {
        console.log(`Adding language: ${lang}`);
        await client.query(
            `INSERT INTO language (c_id, language_spoken) VALUES ($1, $2)`,
            [caretakerId, lang]
        );
    }
} else {
    console.log("No languages provided.");
}


if (specialization) {
    console.log("Inserting main specialization into provides table...");
    await client.query(
        `INSERT INTO provides (specialization_name, c_id) VALUES ($1, $2)`,
        [specialization, caretakerId]
    );
} else {
    console.log("No main specialization provided.");
}


if (additional_skills && additional_skills.length) {
    console.log("Inserting additional skills into provides table...");
    console.log('Additional skills:', additional_skills);

    for (const skill of additional_skills) {
        try {
            console.log(`Adding additional skill: ${skill}`);
            const result = await client.query(
                `INSERT INTO provides (specialization_name, c_id) VALUES ($1, $2)`,
                [skill, caretakerId]
            );
            console.log(`Inserted skill: ${skill} with caretakerId: ${caretakerId}`);
        } catch (err) {
            console.error(`Error inserting skill ${skill}:`, err.message);
        }
    }
} else {
    console.log("No additional skills provided.");
}



        console.log("Committing transaction...");
        await client.query("COMMIT");

        console.log("Caretaker registration successful.");
        res.status(201).json({ message: "Caretaker registered successfully" });

    } catch (err) {
        console.error("Error during caretaker registration:", err);
        console.log("Rolling back transaction...");
        await client.query("ROLLBACK");
        res.status(500).json({ message: "Server error", error: err.message });
    } finally {
        console.log("Releasing database client...");
        client.release();
    }
});

router.get("/new_applications", async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT c_id, first_name, last_name,phone_number,email_address,permanent_address, pr_sp, gender, age, prev_exp,emp_type,expected_salary,profile_image FROM caretaker WHERE status = $1',
            ['pending']
        );

        console.log("Pending applications:", result.rows);
        res.status(200).json(result.rows); // returns [] if none
    } catch (err) {
        console.error("Error fetching pending caretakers:", err);
        res.status(500).json({ message: "Server error" });
    }
});
router.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
        if(status==="rejected"){
            await pool.query('DELETE FROM caretaker where c_id=$1',[id]);
            res.status(200).json({messge:"Caretaker rejected and deleted"})
        }else{
      await pool.query('UPDATE caretaker SET status = $1 WHERE c_id = $2', [status, id]);
      res.status(200).json({ message: `Status updated to ${status}` });
        }
    } catch (err) {
      console.error("Error updating status:", err);
      res.status(500).json({ message: "Failed to update status" });
    }
  });
 router.post("/book-caretaker", authenticateUser, async (req, res) => {
  const {
    c_id,                    
    customer_name,           
    customer_phone_number,    
    start_date,               
    days_per_week,            
    hours_worked,             
    is_full_time,             
  } = req.body;

  const user_id = req.user.ID || req.body.id;
  if (!user_id) {
    return res.status(400).json({ message: "User ID is missing!" });
  }
  console.log({
    user_id,
    c_id,
    customer_name,
    customer_phone_number,
    start_date,
    days_per_week,
    hours_worked,
    is_full_time,
  });

  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (is_full_time) {
       
        await client.query(
          `CALL book_caretaker_full(
            $1::integer, $2::integer, $3::date, $4::varchar, $5::varchar
          )`,
          [
            c_id,                   
            user_id,                 
            start_date,                
            customer_name,             
            customer_phone_number     
          ]
        );
      } else {
       
        await client.query(
          `CALL book_caretaker_part(
            $1::integer, $2::integer, $3::integer, $4::date, $5::integer, $6::varchar, $7::varchar
          )`,
          [
            user_id,                  
            c_id,                      
            hours_worked,              
            start_date,                 
            days_per_week,             
            customer_name,              
            customer_phone_number       
          ]
        );
      }

      await client.query("COMMIT");

      res.status(200).json({ message: "Caretaker booked successfully!" });

    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Procedure Error:", err);
      res.status(500).json({ error: "Something went wrong during booking!" });
    } finally {
      client.release();
    }

  } catch (err) {
    console.error("Connection Error:", err);
    res.status(500).json({ error: "Database connection failed!" });
  }
});

router.get('/view_bookings', async (req, res) => {
    try {
        console.log('Fetching bookings...');

        
        const partTimeQuery = `
            SELECT 
                bp.booking_id,
                'Part-time' AS type,
                CONCAT(c.first_name, ' ', c.last_name) AS caretaker_name,
                bp.start_date,
                bp.hours_worked,
                bp.customer_name,
                bp.customer_phone_number
                
            FROM Books_PT bp
            JOIN Caretaker c ON bp.c_id = c.c_id
            WHERE c.emp_type = 'Part-time'
        `;

        
        const fullTimeQuery = `
            SELECT 
                ft.booking_id,
                'Full-time' AS type,
                CONCAT(c.first_name, ' ', c.last_name) AS caretaker_name,
                ft.start_date,
                NULL AS hours_worked,
                ft.customer_name,
                ft.customer_phone_number
                
            FROM Full_Time ft
            JOIN Caretaker c ON ft.c_id = c.c_id
            WHERE c.emp_type = 'Full-time'
        `;

       
        const combinedQuery = `
            (${partTimeQuery})
            UNION
            (${fullTimeQuery})
            ORDER BY start_date DESC
        `;

        const { rows } = await pool.query(combinedQuery);
        console.log('Fetched bookings:', rows);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/cancel_booking', async (req, res) => {
    console.log("Received cancel request with body:", req.body);
    const { emp_type, bookingId } = req.body;
  
    console.log("Extracted values:", { emp_type, bookingId });
  
    try {
     
      await pool.query('BEGIN');
  
      let deleteResult;
  
      if (emp_type === 'Part-time') {
        console.log(`Canceling part-time booking: ${bookingId}`);
        deleteResult = await pool.query(
          'DELETE FROM books_pt WHERE booking_id = $1 RETURNING *',
          [bookingId]
        );
      } else if (emp_type === 'Full-time') {
        console.log(`Canceling full-time booking: ${bookingId}`);
        deleteResult = await pool.query(
          'DELETE FROM full_time WHERE booking_id = $1 RETURNING *',
          [bookingId]
        );
      } else {
        throw new Error(`Invalid employee type: ${emp_type}`);
      }
  
      console.log("Delete result:", deleteResult.rows);
  
     
      await pool.query('COMMIT');
      res.status(200).json({ message: 'Booking canceled successfully' });
  
    } catch (error) {
      
      await pool.query('ROLLBACK');
      console.error('Error canceling booking:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });
  

    return router;
};

