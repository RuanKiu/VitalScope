import React, { Fragment, useState, useEffect } from "react";
import User from "./User";
import { toast } from "react-toastify";

function Groups() {
  const [inputs, setInputs] = useState({
    groupName: "",
    groupCode: "",
  });

  const [biggestChanges, setChange] = useState([]);

  const [creds, setCreds] = useState({});

  const [patients, setPatients] = useState([]);

  const [allData, setAllData] = useState([]);

  const { groupName, groupCode } = inputs;

  const [mHeart, setMH] = useState(undefined);
  const [mResp, setMR] = useState(undefined);
  const [mpefr, setMP] = useState(undefined);
  const [mspo2, setMS] = useState(undefined);

  const [maxHeart, setMaxHeart] = useState(undefined);
  const [maxResp, setMaxResp] = useState(undefined);

  const onChangeInput = (e) => {
    try {
      setInputs({
        ...inputs,
        [e.target.name]: e.target.value,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = {
        ...inputs,
      };
      const response = await fetch("/server/groups/users", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(body),
      });

      const parsed = await response.json();
      if (parsed === "This group doesn't exist") {
        toast.error("This group does not exist");
        setInputs({
          groupName: "",
          groupCode: "",
        });
        return;
      }
      setPatients(parsed);
      setCreds({
        ...inputs,
      });
      setInputs({
        groupName: "",
        groupCode: "",
      });
    } catch (error) {
      toast.error("Incorrect group code.");
      console.log(error);
    }
  };

  const average = (datapoints) => {
    try {
      let sum = 0;
      for (let i = 0; i < datapoints.length; i++) {
        sum = sum + datapoints[i];
      }
      return sum / datapoints.length;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllData = async () => {
    try {
      const body = {
        ...creds,
      };
      const response = await fetch("/server/data/all", {
        method: "POST",
        headers: { "Content-Type": "Application/json" },
        body: JSON.stringify(body),
      });
      const parsed = await response.json();
      setAllData(parsed);
    } catch (error) {
      console.log(error);
    }
  };

  const analyzeChanges = () => {
    if (!biggestChanges.length > 0 || !biggestChanges) return;

    setMaxHeart(biggestChanges[0]);
    setMaxResp(biggestChanges[0]);
  };

  const getMaxes = () => {
    if (!maxHeart || maxHeart === {} || !maxResp || maxResp === {}) return;
    for (let i = 0; i < biggestChanges.length; i++) {
      if (
        biggestChanges[i].heartInfo.heartrate > maxHeart.heartInfo.heartrate
      ) {
        setMaxHeart(biggestChanges[i]);
      }
      if (biggestChanges[i].respInfo.resprate > maxResp.respInfo.resprate) {
        setMaxResp(biggestChanges[i]);
      }
    }
  };

  //HOOKS

  useEffect(() => {
    getMaxes();
  }, [maxHeart, maxResp]);

  useEffect(() => {
    analyzeChanges();
  }, [biggestChanges]);

  useEffect(() => {
    getAllData();
  }, [creds]);

  useEffect(() => {
    if (allData === "This group doesn't exist" || allData.length === 0) return;

    const heartRateArray = allData.map((datapoint) => {
      return datapoint.heartrate;
    });
    setMH(heartRateArray);

    const respRateArray = allData.map((datapoint) => {
      return datapoint.resprate;
    });
    setMR(respRateArray);

    const pefrArray = allData
      .filter(
        (datapoint) =>
          datapoint.pefr !== undefined ||
          datapoint.pefr !== null ||
          datapoint.pefr
      )
      .map(
        (datapoint) => {
          return datapoint.pefr;
        },
        [allData]
      );
    setMP(pefrArray);

    const spo2Array = allData
      .filter(
        (datapoint) =>
          datapoint.spo2 !== undefined ||
          datapoint.spo2 !== null ||
          datapoint.spo2
      )
      .map(
        (datapoint) => {
          return datapoint.spo2;
        },
        [allData]
      );
    setMS(spo2Array);
  }, [allData]);

  return (
    <Fragment>
      <div className="main">
        <div className="title my-10">
          <h1>Groups</h1>
        </div>
        <form id="get-data-form" onSubmit={(e) => onSubmitForm(e)}>
          <div className="form-content my-10">
            <div className="formcontrol my-5">
              <label htmlFor="groupName">Group Name</label>
              <input
                type="text"
                name="groupName"
                value={groupName}
                onChange={(e) => onChangeInput(e)}
                required
                autoCapitalize="off"
                minLength="2"
              ></input>
            </div>
            <div className="formcontrol my-5">
              <label htmlFor="groupCode">Group Code</label>
              <input
                type="text"
                name="groupCode"
                value={groupCode}
                onChange={(e) => onChangeInput(e)}
                required
                autoCapitalize="off"
                minLength="2"
              ></input>
            </div>
            <button className="form-button" type="submit">
              &raquo;
            </button>
          </div>
        </form>
        {maxHeart &&
          maxHeart !== undefined &&
          maxHeart.heartInfo.datadate !== undefined && (
            <div className="center">
              <div className="title-thin px-5">
                <h3>Largest Change in Heart Rate: {maxHeart.HDiff} Be/Min</h3>
              </div>
              <div className="text my-5">
                <p>
                  {maxHeart.FName} {maxHeart.LName} <br />
                  {maxHeart.heartInfo.heartrate} Beats Per Minute
                  <br />
                  {maxHeart.heartInfo.datadate.split("T")[0]}
                </p>
              </div>
            </div>
          )}
        {maxResp &&
          maxResp !== undefined &&
          maxResp.respInfo.datadate !== undefined && (
            <div className="center">
              <div className="title-thin px-5">
                <h3>
                  Largest Change in Respiratory Rate: {maxResp.RDiff} Br/Min
                </h3>
              </div>
              <div className="text my-5">
                <p>
                  {maxResp.FName} {maxResp.LName} <br />
                  {maxResp.respInfo.resprate} Breaths Per Minute
                  <br />
                  {maxResp.respInfo.datadate.split("T")[0]}
                </p>
              </div>
            </div>
          )}

        {mHeart && (
          <div className="title-thin my-5 px-5">
            <h4>
              Average Heart Rate:{" "}
              {average(mHeart) === 0
                ? "No Data Yet"
                : average(mHeart) + " Be/Min"}{" "}
            </h4>
          </div>
        )}

        {mResp && (
          <div className="title-thin my-5 px-5">
            {" "}
            <h4>
              Average Respiratory Rate:{" "}
              {average(mResp) === 0
                ? "No Data Yet"
                : average(mResp) + " Br/Min"}{" "}
            </h4>
          </div>
        )}
        {mpefr && (
          <div className="title-thin my-5 px-5">
            <h4>
              Average Peak Expiratory Flow Rate:{" "}
              {average(mpefr) === 0 ? "No Data Yet" : average(mpefr) + " L/Min"}{" "}
            </h4>
          </div>
        )}
        {mspo2 && (
          <div className="title-thin my-5 px-5">
            <h4>
              Average Blood Oxygen Saturation:{" "}
              {average(mspo2) === 0 ? "No Data Yet" : average(mspo2) + " %"}
            </h4>
          </div>
        )}
        {patients && patients.length !== 0 && (
          <div className="title my-10">
            <h1>Your Patients</h1>
          </div>
        )}
        {patients &&
          patients.map((patient) => (
            <div key={patient.patientid}>
              <User
                patientId={patient.patientid}
                groupCode={groupCode}
                groupName={groupName}
                setChange={setChange}
                biggestChanges={biggestChanges}
                FName={patient.fname}
                LName={patient.lname}
              ></User>
            </div>
          ))}
      </div>
    </Fragment>
  );
}

export default Groups;
