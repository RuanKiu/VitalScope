const route = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

//GET PATIENT'S DATA

route.post("/", async (req, res) => {
  try {
    const { patientId, groupName, groupCode } = req.body;
    const existingPatient = await pool.query(
      "SELECT * FROM patients WHERE patientid = $1",
      [patientId]
    );
    if (existingPatient.rows.length === 0)
      return res.json("user does not exist");

    const exisitingGroup = await pool.query(
      "SELECT * FROM groups WHERE groupname = $1",
      [groupName]
    );
    if (exisitingGroup.rows.length === 0)
      return res.json("This group doesn't exist");

    bcrypt.compare(
      groupCode,
      exisitingGroup.rows[0].groupcode,
      async (err, result) => {
        if (result) {
          const patientData = await pool.query(
            "SELECT * FROM datapoints WHERE patientid = $1",
            [patientId]
          );
          res.json(patientData.rows);
        } else {
          res.sendStatus(403);
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json("an error occured on the server");
  }
});

module.exports = route;
