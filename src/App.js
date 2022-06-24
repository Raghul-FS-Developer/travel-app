
import React, { useEffect, useState } from "react";
import "./App.css";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { BsFillPinMapFill } from "react-icons/bs";
import axios from "axios";
import Register from "./component/register";
import { format } from "timeago.js";
import Login from "./component/login";


function App() {
  const myStorage = window.localStorage;
  const [currentuser, setCurrentuser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newplace, setNewPlace] = useState(null);
  const [tittle, setTittle] = useState("");
  const [discription, setDiscription] = useState("");
  const [rating, setRating] = useState(1);
  const [showregister, setShowregister] = useState(false);
  const [showlogin, setShowlogin] = useState(false);

  useEffect(() => {
    getpins();
  }, []);

  const getpins = async () => {
    try {
      let res = await axios.get("https://travel-app-t.herokuapp.com/getpins");

      setPins(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  let markerClick = (e) => {
    setCurrentPlaceId(e._id);
  };

  const AddPlace = (e) => {
    const long = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPlace({ long: long, lat: lat });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    if (currentuser === null) {
      alert("First you have to Register & Login then you can Add Pins");
    } else {
      const data = {
        username: currentuser,
        tittle,
        rating,
        discription,
        lat: newplace.lat,
        long: newplace.long,
      };
      try {
        let res = await axios.post("https://travel-app-t.herokuapp.com/pins", data);
        getpins();
        setNewPlace(null);
      } catch (err) {
        console.log(err);
      }
    }
  };
  let handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentuser(null);
  };
  let handleDelete = async (id) => {
    try {
      let res = window.confirm("Do you want delete this pin");
      if (res === true) {
        let ress = await axios.delete(`https://travel-app-t.herokuapp.com/delete/${id}`);
        if (ress.data == "deleted") {
          getpins();
          setCurrentPlaceId(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Map
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 2,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapboxAccessToken="pk.eyJ1IjoicmFnaHVsNzciLCJhIjoiY2wxcWd0cWJsMDQ0ODNjcGFkdmw3eGplZCJ9.rTNNCZKi_2zB00442vznOA"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={AddPlace}
      >
        {pins.map((e) => (
          <>
            <Marker latitude={e.lat} longitude={e.long} anchor="bottom">
              <FaMapMarkerAlt
                size={15}
                style={{
                  cursor: "pointer",
                  color: e.username === currentuser ? "red" : "slateblue",
                }}
                onClick={() => markerClick(e)}
              />
            </Marker>

            {e._id === currentPlaceId && (
              <Popup
                latitude={e.lat}
                longitude={e.long}
                anchor="bottom"
                closeButton={true}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <div className="card2">
                    <p
                      style={{
                        padding: "0px",
                        margin: "0px",
                        fontSize: "10px",
                        color: "crimson",
                      }}
                    >
                      <b>Place&nbsp;:&nbsp;</b>
                    </p>
                    <p
                      style={{ padding: "0px", margin: "0px", fontSize: "9px" }}
                    >
                      {e.tittle}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        padding: "0px",
                        margin: "0px",
                        fontSize: "10px",
                        color: "crimson",
                        textDecoration: "underline",
                      }}
                    >
                      <b>Review</b>
                    </p>
                    <p
                      style={{ padding: "0px", margin: "0px", fontSize: "9px" }}
                    >
                      {e.discription}
                    </p>
                  </div>
                  <div className="card2">
                    <p
                      style={{
                        padding: "0px",
                        margin: "0px",
                        fontSize: "10px",
                        color: "crimson",
                      }}
                    >
                      <b>Rating&nbsp;:&nbsp;</b>
                    </p>
                    <div className="icons">
                      {Array(e.rating).fill(<AiFillStar />)}
                    </div>
                  </div>
                  <div>
                    <p
                      style={{
                        padding: "0px",
                        margin: "0px",
                        fontSize: "10px",
                        color: "crimson",
                        textDecoration: "underline",
                      }}
                    >
                      <b>Information</b>
                    </p>
                    <p
                      style={{
                        padding: "0px",
                        margin: "0px",
                        fontSize: "10px",
                      }}
                    >
                      Created by{" "}
                      <span style={{ color: "crimson" }}>{e.username}</span>
                      &nbsp;{format(e.createdAt)}
                    </p>
                  </div>
                </div>
                {e.username === currentuser && (
                  <button className="deletebtn" onClick={() => handleDelete(e._id)}>Delete</button>
                )}
              </Popup>
            )}
          </>
        ))}
        {newplace && (
          <Popup
            latitude={newplace.lat}
            longitude={newplace.long}
            anchor="bottom"
            closeButton={true}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <p
                  style={{
                    padding: "0px",
                    marginTop: "10px",
                    marginBottom: "0px",
                    fontSize: "13px",
                    color: "crimson",
                  }}
                >
                  <b>Place&nbsp;:&nbsp;</b>
                </p>
                <input
                  placeholder="Enter the place name"
                  minLength={3}
                  maxLength={25}
                  required
                  onChange={(e) => setTittle(e.target.value)}
                ></input>
                <p
                  style={{
                    padding: "0px",
                    marginTop: "10px",
                    marginBottom: "0px",
                    fontSize: "13px",
                    color: "crimson",
                  }}
                >
                  <b>Review&nbsp;:&nbsp;</b>
                </p>
                <textarea
                  placeholder="Share your experience"
                  minLength={20}
                  maxLength={55}
                  required
                  onChange={(e) => setDiscription(e.target.value)}
                ></textarea>
                <div className="card2">
                  <p
                    style={{
                      padding: "0px",
                      margin: "0px",
                      fontSize: "13px",
                      color: "crimson",
                    }}
                  >
                    <b>Rating&nbsp;:&nbsp;</b>
                  </p>
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="addpin">
                    Add Pin&nbsp;
                    <BsFillPinMapFill />
                  </button>
                </div>
              </form>
            </div>
          </Popup>
        )}
      </Map>
      <div className="menu">
        {currentuser ? (
          <button className="logout" onClick={handleLogout}>
            logout
          </button>
        ) : (
          <div className="btns">
            <button className="btn" onClick={() => setShowlogin(true)}>
              login
            </button>
            <button className="btn" onClick={() => setShowregister(true)}>
              Register
            </button>
          </div>
        )}
      </div>
      {showregister && (
        <Register
          setShowlogin={setShowlogin}
          setShowregister={setShowregister}
        />
      )}
      {showlogin && (
        <Login
          setShowlogin={setShowlogin}
          myStorage={myStorage}
          setCurrentuser={setCurrentuser}
        />
      )}
    </>
  );
}

export default App;
