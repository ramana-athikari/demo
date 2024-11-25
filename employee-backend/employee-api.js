// const express = require("express");
// const router = express.Router();
// module.exports= router;

// const Employee = require("./employee-schema");

// router.post("/", async(req, res)=>{
//     let newEmp = Employee({
//         f_Image     : req.body.file,
//         f_Name      : req.body.ename,
//         f_Email     : req.body.email,
//         f_Mobile    : req.body.mobile,
//         f_Designation: req.body.designation,
//         f_Gender    : req.body.gender,
//         f_Course    : req.body.course,
//         f_Createdate: req.body.date

//         // f_Id        : "1",
//         // f_Image     : "2",
//         // f_Name      : "2",
//         // f_Email     : "2",
//         // f_Mobile    : "2",
//         // f_Designation: "2",
//         // f_Gender    : "2",
//         // f_Course    : "2",
//         // f_Createdate: "2"
//     });

//     let eInfo = await newEmp.save();

//     res.status(200).json(eInfo);
// });

// router.get("/data", async(req,res)=>{
//   let employeeInfo = await Employee.find();
//   res.status(200).json(employeeInfo);
// });

// router.get("/", async (req, res) => {
//   const { f_Email } = req.query;

//   try {
//     // Check if email exists in the database
//     const employee = await Employee.findOne({ f_Email });

//     if (employee) {
//       return res.status(200).json({ message: "Email already exists" });
//     } else {
//       return res.status(200).json([]); // No duplicate found
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


const express = require("express");
const router = express.Router();
const Employee = require("./employee-schema"); // Assuming this is your Mongoose schema

// Create a new employee
router.post("/", async (req, res) => {
  let newEmp = new Employee({
    f_Image: req.body.file,
    f_Name: req.body.ename,
    f_Email: req.body.email,
    f_Mobile: req.body.mobile,
    f_Designation: req.body.designation,
    f_Gender: req.body.gender,
    f_Course: req.body.course,
    f_Createdate: req.body.date,
  });

  try {
    let eInfo = await newEmp.save();
    res.status(200).json(eInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save employee" });
  }
});

// Get all employee data
router.get("/data", async (req, res) => {
  try {
    let employeeInfo = await Employee.find();
    res.status(200).json(employeeInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employee data" });
  }
});

// Check if email exists
router.post("/check-email", async (req, res) => {
  const { email } = req.body; // Get email from the request body

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if the email already exists in the database
    const employee = await Employee.findOne({ f_Email: email });

    if (employee) {
      // Email exists
      return res.status(409).json({ message: "Email already exists" });
    } else {
      // Email does not exist
      return res.status(200).json({ message: "Email is available" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:empId", async(req,res)=>{
  let id = req.params.empId;
  try{
    let empInfo = await Employee.findById(id);
    if(empInfo==null){
        res.status(200).json({"message":"No such Records"});
    }else{
        await empInfo.deleteOne();
        res.status(200).json({"message":"Employee Deleted Successfully"});
    }
  }
  catch(error){
    console.log(error);
  }
})

module.exports = router;

// Update Employee Route (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { f_Name, f_Email, f_Mobile, f_Designation, f_Gender, f_Course, f_Image } = req.body;

  try {
    // Find the employee by ID and update the details
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        f_Name,
        f_Email,
        f_Mobile,
        f_Designation,
        f_Gender,
        f_Course,
        f_Image,
      }     // Return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Send the updated employee back as a response
    res.status(200).json(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating employee' });
  }
});