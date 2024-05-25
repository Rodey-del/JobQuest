import React, { useState } from "react";
import { toast } from "react-toastify";
import { userMessageApi } from "../api/api";

const Contact = () => {
  // making usestate for state variables
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  // making a function to send the data from button


  const [fullNameerror, setFullNameerror] = useState("");
  const [emailerror, setEmailerror] = useState("");
  const [phoneNumerror, setPhoneNumerror] = useState("");
  const [addresserror, setAddresserror] = useState("");
  const [messageerror, setMessageerror] = useState("");

  // validation function
  const validate = () => {
    let isvalid = true;
    if (fullName.trim() === "") {
      setFullNameerror("Fullname is required");
    //   toast.warning(fullNameerror)
      isvalid = false;
    }
    if (email.trim() === "") {
      setEmailerror("Email is required");
    //   toast.warning(emailerror)
      isvalid = false;
    }
    if (phoneNum.trim() === "") {
      setPhoneNumerror("Phonenum is required");
    //   toast.warning(phoneNumerror)
      isvalid = false;
    }
    if (address.trim() === "") {
      setAddresserror("Address is required");
    //   toast.warning(addresserror)
      isvalid = false;
    }
    if (message.trim() === "") {
      setMessageerror("Message is required");
    //   toast.warning(messageerror)
      isvalid = false;
    }
    return isvalid;
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const isValid = validate();
    if (!isValid) {
        toast.warning("Enter all filed")
        return false;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phoneNum", phoneNum);
    formData.append("address", address);
    formData.append("message", message);

    userMessageApi(formData)
      .then((res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          setFullName("");
          setEmail("");
          setPhoneNum("");
          setAddress("");
          setMessage("");
        }
      })
      .catch((e) => {
        toast.error("Server Error!!!");
        console.log(e);
      });
  };

  return (
    <>
    <main className="flex flex-col w-full h-auto font-[Poppins] text-black bg-[#F2F1F2] py-10">
        <div className="md:w-[75%] w-[95%] mx-auto my-auto md:px-12 md:py-12 p-5 rounded-3xl md:mt-14 mt-0 bg-white shadow-2xl">
            <p className="text-4xl text-[#3779e9] font-bold mb-2">Contact Us</p>
            <p className="text-md font-normal text-neutral-500 mb-6">
                Your email address will not be provided.
            </p>
            <form onSubmit={handleContactSubmit}>
                <div className="flex flex-wrap w-full my-4 justify-between gap-y-8">
                    <input
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            setFullNameerror("");
                        }}
                        className="bg-neutral-100 px-4 py-3 rounded-lg w-full md:w-[48%] outline-none focus:ring-2 focus:ring-[#3779e9] shadow-md"
                        type="text"
                        placeholder="Full Name"
                    />
                    <input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailerror("");
                        }}
                        className="bg-neutral-100 px-4 py-3 rounded-lg w-full md:w-[48%] outline-none focus:ring-2 focus:ring-[#3779e9] shadow-md"
                        type="email"
                        placeholder="Email"
                    />
                </div>
                <div className="flex flex-wrap w-full my-4 justify-between gap-y-8">
                    <input
                        value={phoneNum}
                        onChange={(e) => {
                            setPhoneNum(e.target.value);
                            setPhoneNumerror("");
                        }}
                        className="bg-neutral-100 px-4 py-3 rounded-lg w-full md:w-[48%] outline-none focus:ring-2 focus:ring-[#3779e9] shadow-md"
                        type="number"
                        placeholder="Phone Number"
                    />
                    <input
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setAddresserror("");
                        }}
                        className="bg-neutral-100 px-4 py-3 rounded-lg w-full md:w-[48%] outline-none focus:ring-2 focus:ring-[#3779e9] shadow-md"
                        type="text"
                        placeholder="Address"
                    />
                </div>
                <textarea
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                        setMessageerror("");
                    }}
                    className="w-full px-4 py-3 bg-neutral-100 rounded-lg outline-none focus:ring-2 focus:ring-[#3779e9] shadow-md h-40"
                    placeholder="Message"
                ></textarea>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="mt-5 px-6 py-3 bg-[#3779e9] text-white font-bold rounded-lg hover:bg-[#2556a1] transition-all transform hover:scale-105 shadow-lg"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </main>
</>
  );
};

export default Contact;
