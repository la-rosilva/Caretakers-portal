import React from "react";
import { useState } from "react";
import { Form, Input, DatePicker, Select, Upload, Button, Radio, InputNumber } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Option } = Select;
const specializationOptions = [
  "Nursing",
  "Dementia Care",
  "Physiotherapy",
  "Elderly Care",
  "Housekeeping",
  "Child Care",
  "Post-Surgery Assistance",
  "Culinary Assistance",
];

import { toast } from "react-toastify";  // make sure this is imported

const handleSubmit = async (values) => {
  console.log("Form Submitted: ", values);

  const formData = new FormData();

  Object.keys(values).forEach((key) => {
    if (Array.isArray(values[key])) {
      // If it's already an array, JSON.stringify it directly
      formData.append(key, JSON.stringify(values[key]));
    } else if (key === "additional_skills" || key === "languages") {
      // Only append if the value is not null/undefined/empty
      if (values[key]) {
        formData.append(key, JSON.stringify([values[key]]));
      }
      // If it's null/undefined/empty string, skip appending
    } else {
      // For other fields, directly append the value
      formData.append(key, values[key]);
    }
  });
  

  const profilePhoto = values.profilePhoto && values.profilePhoto[0]?.originFileObj;
  if (profilePhoto) {
    formData.append('profilePhoto', profilePhoto);
  }

  try {
    const response = await fetch("/auth/register-caretaker", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      toast.success("Registration Successful!", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored"
      });
    } else {
      toast.error("Registration unsuccessful", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored"
      });
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Something went wrong!", {
      position: "top-right",
      autoClose: 5000,
      theme: "colored"
    });
  }
};



const CaretakerForm = () => {
  const [form] = Form.useForm();
  const [employeeType, setEmployeeType] = useState(null); 
  const handleEmployeeTypeChange = (value) => {
    setEmployeeType(value);
  };

  // const handleSubmit = (values) => {
  //   console.log("Form Submitted: ", values);
  // };

  return (
    <div className="w-full min-h-screen p-10 flex items-center justify-center bg-white">
      <div className="bg-white p-10 rounded-lg w-full max-w-4xl">
        <h1 className="text-2xl font-semibold text-center mb-6 text-cyan-600 bg-gray-200">Caretaker Registration Form</h1>
        
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Personal Details */}
          <h2 className="text-lg font-semibold mb-4 text-cyan-600">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="FirstName" label="First Name" rules={[{ required: true, message: "Please enter your full name" }]}> 
              <Input placeholder="Enter your first name" />
            </Form.Item>
            <Form.Item name="LastName" label="Last Name"> 
              <Input placeholder="Enter your last name" />
            </Form.Item>
            <Form.Item name="dob" label="Date of Birth" rules={[{ required: true, message: "Please select your date of birth" }]}> 
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="gender" label="Gender" rules={[{ required: true, message: "Please select your gender" }]}> 
              <Radio.Group>
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
            
              </Radio.Group>
            </Form.Item>
            
          </div>

          {/* Contact Details */}
          <h2 className="text-lg font-semibold mt-6 mb-4 text-cyan-600">Contact Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter your phone number" }]}> 
              <Input placeholder="Enter your phone number" />
            </Form.Item>
            <Form.Item name="email" label="Email Address" rules={[{ type: "email", message: "Please enter a valid email" }]}> 
              <Input placeholder="Enter your email" />
            </Form.Item>
          </div>
          <Form.Item name="permanentAddress" label="Permanent Address" rules={[{ required: true, message: "Please enter your permanent address" }]}> 
            <Input.TextArea placeholder="Enter your permanent address" rows={2} />
          </Form.Item>
          

          {/* Work-Related Details */}
          <h2 className="text-lg font-semibold mt-6 mb-4 text-cyan-600">Work-Related Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="experience" label="Previous Experience (Years)" rules={[{ required: true, message: "Please enter years of experience" }]}> 
              <InputNumber min={0} max={50} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="expectedSalary" label="Expected Salary" rules={[{ required: true, message: "Please enter expected salary" }]}> 
              <InputNumber min={0} style={{ width: "100%" }} prefix="₹" />
            </Form.Item>
            <Form.Item name="emp_type" label="Work-type" rules={[{ required: true, message: "Please select your availability" }]}> 
              <Select placeholder="Select availability" onChange={handleEmployeeTypeChange}>
                <Option value="Full-time">Full-time</Option>
                <Option value="Part-time">Part-time</Option>
              </Select>
            </Form.Item>
           
          </div>
          {employeeType === 'Part-time' && (
        <Form.Item name="hours_per_day" label="Hours per day" rules={[{ required: true, message: "Please enter hours per day" }]}>
          <InputNumber min={1} max={24} style={{ width: "20%" }} />
        </Form.Item>
      )}
          <Form.Item
        name="specialization"
        label="Primary Specialization"
        rules={[{ required: true, message: "Please select your primary specialization" }]}
      >
        <Select placeholder="Select your primary specialization">
          {specializationOptions.map((spec) => (
            <Option key={spec} value={spec}>
              {spec}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="additional_skills"
        label="Additional Specializations (if any)"
       
      >
        <Select
          mode="multiple"
          placeholder="Select additional specializations"
          allowClear
        >
          {specializationOptions.map((spec) => (
            <Option key={spec} value={spec}>
              {spec}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
  name="languages"
  label="Languages Spoken"
  rules={[{ required: true, message: "Please select at least one language" }]}
>
  <Select
    mode="multiple"
    placeholder="Select languages you can speak"
    options={[
      { label: "English", value: "english" },
      { label: "Hindi", value: "hindi" },
      { label: "Kannada", value: "kannada" },
      { label: "Tulu", value: "tulu" },
      { label: "Telugu", value: "telugu" },
      { label: "Sanskrit", value: "sanskrit" },
      { label: "Marathi", value: "marathi" },
      { label: "Konkani", value: "konkani" },
      { label: "Tamil", value: "tamil" },
      { label: "Malayalam", value: "malayalam" },
      { label: "French", value: "french" },
      { label: "Spanish", value: "spanish" },
      { label: "Arabic", value: "arabic" },
      { label: "German", value: "german" }
    ]}
  />
</Form.Item>


          {/* Profile Photo */}
          <h2 className="text-lg font-semibold mt-6 mb-4 text-cyan-600">Upload Profile Photo</h2>
          <Form.Item
  name="profilePhoto"
  label="Upload Profile Photo"
  valuePropName="fileList"
  getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
  rules={[{ required: true, message: "Please upload a profile photo" }]}
> <Upload.Dragger
    name="profilePhoto"
    listType="picture"
    accept="image/*"
    maxCount={1}
    beforeUpload={() => false} 
  >
     <p className="ant-upload-drag-icon">
      <InboxOutlined className="!text-cyan-600" />
    </p>
    <p className="ant-upload-text">Click or drag an image to upload</p>
    <p className="ant-upload-hint">Only one image allowed.</p>
  </Upload.Dragger>
</Form.Item>

          {/* Submit Button */}
          <Form.Item className="text-center">
            <Button type="primary" htmlType="submit" className="w-full !bg-cyan-600">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CaretakerForm;
