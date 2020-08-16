const route = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcrypt");

//MAKE GROUP

route.post("/", async (req, res) => {
  try {
    const { groupName, groupCode } = req.body;
    const existingGroups = await pool.query(
      "SELECT * FROM groups WHERE groupName = $1",
      [groupName]
    );
    if (existingGroups.rows.length !== 0)
      return res.json("This group already exists!");

    //MAKE CODE
    const code = await bcrypt.hash(groupCode, 10);
    const newGroup = await pool.query(
      "INSERT INTO groups (groupName, groupCode) VALUES ($1, $2) RETURNING *",
      [groupName, code]
    );
    return res.json({
      groupCode: groupCode,
      groupName: newGroup.rows[0].groupname,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("an error occured on the server");
  }
});

//GET GROUP'S PATIENTS

route.post("/users", async (req, res) => {
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
          const groupPatients = await pool.query(
            "SELECT * FROM patients WHERE groupname = $1",
            [groupName]
          );
          return res.json(groupPatients.rows);
        } else {
          return res.sendStatus(403);
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json("an error occured on the server");
  }
});

module.exports = route;
