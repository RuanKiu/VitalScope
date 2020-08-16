const route = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

//MAKE DATA

route.post("/", async (req, res) => {
  try {
    const {
      FName,
      LName,
      heartRate,
      respRate,
      spo2,
      pefr,
      groupName,
    } = req.body;
    let existingPatient = await pool.query(
      "SELECT * FROM patients WHERE fname = $1 AND lname = $2",
      [FName, LName]
    );
    if (existingPatient.rows.length === 0) {
      existingPatient = await pool.query(
        "INSERT INTO patients (fname, lname, groupname) VALUES ($1, $2, $3) RETURNING *",
        [FName, LName, groupName]
      );
    }
    const newData = await pool.query(
      "INSERT INTO datapoints (groupname, patientid, heartrate, resprate, spo2, pefr) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        groupName,
        existingPatient.rows[0].patientid,
        heartRate,
        respRate,
        spo2,
        pefr,
      ]
    );
    return res.json(newData.rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json("An error occured on the server");
  }
});

//GET ALL DATA

route.post("/all", async (req, res) => {
  try {
    const { groupCode, groupName } = req.body;
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
          const groupData = await pool.query(
            "SELECT * FROM datapoints WHERE groupname = $1",
            [groupName]
          );
          return res.json(groupData.rows);
        } else {
          res.sendStatus(403);
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json("An error has occured on the server");
  }
});

module.exports = route;
