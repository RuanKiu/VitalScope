import React, { Fragment, useState } from "react";
import Oximeter from "../oximeter.jpeg";
import PFM from "../PFM.jpeg";
import { toast } from "react-toastify";

function Data() {
  const [inputs, setInputs] = useState({
    FName: "",
    LName: "",
    heartRate: 0,
    spo2: undefined,
    pefr: undefined,
    respRate: 0,
    groupName: "",
  });

  const [togHeart, setTH] = useState(false);
  const [togResp, setTR] = useState(false);
  const [togpefr, setTP] = useState(false);
  const [togspo2, setTS] = useState(false);

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

  const onSubmitform = async (e) => {
    e.preventDefault();
    try {
      const body = {
        ...inputs,
      };
      const response = await fetch("/server/data/", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "Application/json" },
      });
      const parsed = await response.json();
      if (parsed === "This group doesn't exist!") {
        toast.error("This group doesn't exist!");
      } else {
        toast.success("Data Entered");
      }
      document.getElementById("data-form").reset();
    } catch (error) {
      toast.error("This group doesn't exist!");

      console.log(error);
    }
  };

  return (
    <Fragment>
      <div className="main">
        <div className="title my-15">
          <h1>Add Data</h1>
        </div>

        <div className="main"></div>
        <form onSubmit={(e) => onSubmitform(e)} id="data-form">
          <div className="form-content my-10">
            <div className="formcontrol my-5">
              <label htmlFor="Fname">First Name</label>
              <input
                name="FName"
                onChange={(e) => onChangeInput(e)}
                required
                autoCapitalize="off"
                minLength="2"
              ></input>
            </div>

            <div className="formcontrol my-5">
              <label htmlFor="LName">Last Name</label>
              <input
                name="LName"
                onChange={(e) => onChangeInput(e)}
                required
                autoCapitalize="off"
                minLength="2"
              ></input>
            </div>
            <div className="formcontrol my-5">
              <label htmlFor="heartRate">Heart Rate</label>
              <input
                name="heartRate"
                onChange={(e) => onChangeInput(e)}
                required
                type="number"
              ></input>
            </div>
            <button
              className="help-button"
              onClick={(e) => {
                togHeart ? setTH(false) : setTH(true);
              }}
              type="button"
            >
              ?
            </button>
            {togHeart && (
              <div className="text my-5">
                <p>
                  Put your index and middle finger to the left of your windpipe
                  where your neck connects to the tissues underneath your jaw.
                  You should be able to feel your pulse on either side of your
                  windpipe, but it might be easier to find on the left side. You
                  may need to move your fingers around and press a little harder
                  until you feel it. Use a clock or stopwatch to keep track of
                  15 seconds, count the pulses you feel, and then multiply by
                  four. You should get about the same result when you measure
                  your pulse at your wrist or your neck.
                </p>
              </div>
            )}
            <div className="formcontrol my-5">
              <label htmlFor="respRate">Respiratory Rate</label>
              <input
                name="respRate"
                onChange={(e) => onChangeInput(e)}
                required
                type="number"
              ></input>
            </div>
            <button
              className="help-button"
              onClick={(e) => {
                togResp ? setTR(false) : setTR(true);
              }}
              type="button"
            >
              ?
            </button>
            {togResp && (
              <div className="text my-5">
                <p>
                  Your respiratory rate is also known as your breathing rate.
                  This is the number of breaths you take per minute. You can
                  measure your breathing rate by counting the number of breaths
                  you take over the course of one minute while you're at rest.
                </p>
              </div>
            )}
            <div className="formcontrol my-5">
              <label htmlFor="spo2">Blood Oxygen Saturation</label>
              <input
                name="spo2"
                onChange={(e) => onChangeInput(e)}
                placeholder="Optional"
                type="number"
              ></input>
            </div>
            <button
              className="help-button"
              onClick={(e) => {
                togspo2 ? setTS(false) : setTS(true);
              }}
              type="button"
            >
              ?
            </button>
            {togspo2 && (
              <div className="text my-5">
                <p>
                  Your blood oxygen level is a measure of how much oxygen your
                  red blood cells are carrying. Maintaining the precise balance
                  of oxygen-saturated blood is vital to your health.<br></br>A
                  pulse oximeter (pulse ox) is a noninvasive device that
                  estimates the amount of oxygen in your blood. To use it,
                  simply clip it on your finger or earlobe and wait for a
                  minute. The reading that appears indicates what percentage of
                  your blood is saturated, known as the SpO2 level.
                </p>
                <img src={Oximeter} className="image rounded"></img>
              </div>
            )}
            <div className="formcontrol my-5">
              {" "}
              <label htmlFor="pefr">Peak Expiratory Flow Rate</label>
              <input
                name="pefr"
                onChange={(e) => onChangeInput(e)}
                placeholder="Optional"
                type="number"
              ></input>
            </div>
            <button
              className="help-button"
              onClick={(e) => {
                togHeart ? setTP(false) : setTP(true);
              }}
              type="button"
            >
              ?
            </button>
            {togpefr && (
              <div className="text my-5">
                <p>
                  Peak flow measurement is a quick test to measure air flowing
                  out of the lungs. The measurement is also called the peak
                  expiratory flow rate (PEFR) or the peak expiratory flow
                  (PEF).During the test, you blow forcefully into the mouthpiece
                  of a device. A peak flow meter (PFM) is used most often. This
                  is a small handheld device made of plastic. A PFM is small and
                  light enough to be used almost anywhere. It’s important to use
                  the same PFM on a regular basis. The readings can vary between
                  brands and types of meters.
                </p>
                <img className="image rounded" src={PFM}></img>
              </div>
            )}
            <div className="formcontrol my-5">
              <label htmlFor="groupName">Group Name</label>
              <input
                name="groupName"
                onChange={(e) => onChangeInput(e)}
                required
                autoCapitalize="off"
                minLength="2"
              ></input>
            </div>
            <button type="submit" className="form-button my-5">
              &raquo;
            </button>
          </div>
        </form>
      </div>
    </Fragment>
  );
}

export default Data;
