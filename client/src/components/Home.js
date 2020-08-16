import React, { Fragment, useState } from "react";
import Logo from "../vitalscope.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const [inputs, setInputs] = useState({
    groupCode: "",
    groupName: "",
  });

  const { groupName, groupCode } = inputs;

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

    const body = {
      ...inputs,
    };
    const response = await fetch("/server/groups", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(body),
    });
    const parsed = await response.json();
    if (parsed === "This group already exists!") {
      toast.error(parsed);
    } else {
      toast.success("Group Created!");
    }
    setInputs({
      groupCode: "",
      groupName: "",
    });
  };

  return (
    <Fragment>
      <div className="main">
        <img src={Logo} className="image"></img>

        <div className="title my-20">
          <h1>VitalScope</h1>
        </div>
        <div className="text px-10">
          <p>
            VitalScope is a tool that helps doctors and nurses track vitals
            after a patient has recovered.<br></br>By monitoring patients'
            health data, disease and sickness can be detected early and
            reinfection can be prevented.
          </p>
        </div>
        <div className="title-thin my-20">
          <h2>Quickstart Guide</h2>
        </div>

        <div className="text my-5 px-10">
          <h3>For Physicians and Medical Staff</h3>
          <p>
            To begin, create a monitoring group for patients to join. <br></br>
            Choose a name and a group code; the code will be used to view your
            patient's data, so keep it confidential.
          </p>
        </div>
        <form id="data-form" onSubmit={(e) => onSubmitForm(e)}>
          <div className="form-content my-10">
            <div className="formcontrol my-5">
              <label htmlFor="groupName">Your Monitoring Group's Name</label>
              <input
                name="groupName"
                value={groupName}
                onChange={(e) => onChangeInput(e)}
                autoCapitalize="off"
                autoComplete="off"
                required
                minLength="2"
              ></input>
            </div>
            <div className="formcontrol my-5">
              <label htmlFor="groupCode">Your Monitoring Group's Code</label>
              <input
                name="groupCode"
                value={groupCode}
                onChange={(e) => onChangeInput(e)}
                autoCapitalize="off"
                autoComplete="off"
                required
                minLength="2"
              ></input>
            </div>

            <button className="form-button" type="submit">
              +
            </button>
          </div>
        </form>
        <div className="text my-5 px-10">
          <h3>For Patients</h3>
          <p>
            Adding and submitting data is quick and simple; head over to the
            'Add Data' page,<br></br> then follow the instructions to obtain
            your vitals
          </p>
        </div>
      </div>
    </Fragment>
  );
}

export default Home;
