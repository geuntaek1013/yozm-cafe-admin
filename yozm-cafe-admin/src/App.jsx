import React, { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [images, setImages] = useState([]);
  const [openingHours, setOpeningHours] = useState([
    { day: "MONDAY", open: "", close: "", opened: true },
    { day: "TUESDAY", open: "", close: "", opened: true },
    { day: "WEDNESDAY", open: "", close: "", opened: true },
    { day: "THURSDAY", open: "", close: "", opened: true },
    { day: "FRIDAY", open: "", close: "", opened: true },
    { day: "SATURDAY", open: "", close: "", opened: true },
    { day: "SUNDAY", open: "", close: "", opened: true },
  ]);
  const [phone, setPhone] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleOpeningHoursChange = (event) => {
    const { name, value } = event.target;
    const updatedOpeningHours = openingHours.map((hour) =>
      hour.day === name
        ? {
            ...hour,
            opened: value === "true",
          }
        : hour
    );

    setOpeningHours(updatedOpeningHours);
  };

  const handleTimeInputChange = (event) => {
    const { name, value } = event.target;
    const [day, timeType] = name.split("-");
    const updatedOpeningHours = openingHours.map((hour) =>
      hour.day === day
        ? {
            ...hour,
            [timeType]: value,
          }
        : hour
    );

    setOpeningHours(updatedOpeningHours);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify({
      name,
      address,
      detail: {
        openingHours,
        phone,
        mapUrl,
        description,
      },
    });

    const json = new Blob([jsonData], { type: "application/json" });

    const formData = new FormData();
    formData.append("request", json);
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await fetch("api/admin/cafes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("데이터 전송 성공");
      } else {
        console.error("데이터 전송 실패");
      }
    } catch (error) {
      console.error("에러:", error);
    }
  };

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files).slice(0, 10);
    setImages(selectedImages);
  };

  const renderOpeningHours = () => {
    return openingHours.map((hour) => (
      <div key={hour.day} className="opening-hours-group">
        <label>{hour.day}</label>
        <div>
          <label>
            <input
              type="radio"
              name={`${hour.day}`}
              value={true}
              checked={hour.opened === true}
              onChange={handleOpeningHoursChange}
            />
            영업
          </label>
          <label>
            <input
              type="radio"
              name={`${hour.day}`}
              value={false}
              checked={hour.opened === false}
              onChange={handleOpeningHoursChange}
            />
            휴무
          </label>
        </div>
        <input
          className="time-input"
          type="text"
          name={`${hour.day}-open`}
          value={hour.open}
          onChange={handleTimeInputChange}
          placeholder="오픈 시간"
        />
        -
        <input
          className="time-input"
          type="text"
          name={`${hour.day}-close`}
          value={hour.close}
          onChange={handleTimeInputChange}
          placeholder="마감 시간"
        />
      </div>
    ));
  };

  return (
    <div className="container">
      <h1>요즘카페 관리자 페이지</h1>
      <form className="form" method="post" encType="multipart/form-data">
        <table className="table">
          <tbody>
            <tr className="form-group">
              <td className="form-label">
                <label htmlFor="name">카페이름</label>
              </td>
              <td className="form-input">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </td>
            </tr>
            <tr className="form-group">
              <td className="form-label">
                <label htmlFor="address">주소</label>
              </td>
              <td className="form-input">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </td>
            </tr>
            <tr className="form-group">
              <td className="form-label">
                <label htmlFor="images">
                  이미지 업로드 <br />
                  (최대 10장)
                </label>
              </td>
              <td className="form-input">
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
              </td>
            </tr>
            <tr className="form-group">
              <td className="form-label">
                <label>영업 시간</label>
              </td>
              <td className="form-input">
                <div className="opening-hours">{renderOpeningHours()}</div>
              </td>
            </tr>
            <tr className="form-group">
              <td className="form-label">
                <label htmlFor="phone">연락처</label>
              </td>
              <td className="form-input">
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </td>
            </tr>
            <tr className="form-group">
              <td className="form-label">
                <label htmlFor="mapUrl">지도 URL</label>
              </td>
              <td className="form-input">
                <input
                  type="text"
                  id="mapUrl"
                  name="mapUrl"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                />
              </td>
            </tr>
            <tr className="form-group">
              <td className="form-label">
                <label htmlFor="description">카페 설명</label>
              </td>
              <td className="form-input">
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button className="submit-button" type="submit" onClick={handleSubmit}>
          제출
        </button>
      </form>
    </div>
  );
}

export default App;
