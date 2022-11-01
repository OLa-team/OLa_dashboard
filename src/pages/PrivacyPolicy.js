import React from "react";
import logo2 from "../../src/assets/logo_2.png";
import logo1 from "../../src/assets/logo_1.png";

function PrivacyPolicy() {
  return (
    <div className="bgPrivacyPolicy">
      <div className="topBar privacyPolicyBar">
        <div className="leftTopBar">
          <img
            src={logo1}
            alt="logo"
            style={{ width: "40px", height: "40px" }}
          />
          <h3>OLa</h3>
        </div>
      </div>

      <div className="content">
        {/* <h1 className="title">Privacy Policy</h1> */}
        <p>
          <i>Last updated on 1st November 2022</i>
        </p>

        <div>
          <h1 className="subTitle">Introduction</h1>
          <p>
            The Oral Anticoagulation application (OLa) provides an easy way for
            user to self-monitor their health and manage their oral
            anticoagulation use using simple tools. Each user will be able to:
          </p>

          <br />

          <ul style={{ listStyle: "inside" }}>
            <li>
              Self-monitor their vital signs like blood pressure and glucose
              levels and bleeding symptoms
            </li>
            <li>Record their daily notes in the health diary</li>
            <li>View the recorded data in tabulated or graphical form</li>
            <li>
              Educate themselves on related medical conditions and oral
              anticoagulants using the learning modules
            </li>
            <li>Set personalized health goals</li>
            <li>Set reminders for clinic appointments</li>
          </ul>

          <p>
            <h3>Source: </h3>OLa Research Team, University of Malaya and Heart
            Failure Clinic, Hospital Kuala Lumpur
          </p>
        </div>

        <div>
          <h1 className="subTitle">Privacy Policy</h1>
          <p>
            <b>Data protection</b> <br /> Leading technologies including
            encryption software is used to safeguard any data given to us and
            strict security standards are maintained to prevent unauthorized
            access. <br /> <br /> <b>Data storage security</b> <br /> To
            safeguard your personal data, all electronic storage and
            transmission of personal data are secured and stored appropriate
            security technologies. <br /> <br /> <b> Security information </b>{" "}
            <br /> University domain has security measures in place against the
            loss, misuse, and alteration of information as defined in the
            University’s Rules and Regulation for the Use of ICT Facilities.{" "}
            <br /> <br /> A login using contact number and secured system
            generated one-time password (OTP) are required to access user
            account. Before personal information (such as self-monitoring
            parameters like blood pressure) is accessed on the healthcare
            professional dashboard, doctors or pharmacists are required to enter
            the application admin-approved email address and a link will be sent
            to that email for access. This is to ensure that the information is
            displayed only to the intended person.
          </p>
        </div>

        <div>
          <h1 className="subTitle">Disclaimer</h1>

          <p>
            This app was created for research purposes with the intention to
            assist users (patients with concurrent atrial fibrillation and heart
            failure) to manage their oral anticoagulation use. However, it is
            not intended to replace the professional clinical judgement. <br />{" "}
            <br />
            The developer makes no claim of the accuracy of the information
            contained herein; and this information are not substitute for
            clinical judgement. <br /> <br />
            All parties involved in the preparation of this application shall
            not be liable for any special, consequential, or exemplary damages
            resulting in whole or part of any user’s use or reliance upon this
            material.
          </p>
        </div>

        <div>
          <h1 className="subTitle">Feedback</h1>
          <p>
            <a href="mailto:ola_admin@um.edu.my">ola_admin@um.edu.my </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
