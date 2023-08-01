import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Box, Pagination, Typography, useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
function ShowTrip() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  let [data, setdata] = useState([]);
  let [trip, setTrip] = useState([]);
  const [pageOffset, setPageOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [id, setid] = useState(0);
  const navigate = useNavigate();

  async function getUsers() {
    if (location.state) {
      const id = location.state.id;
      await axios
        .get("http://127.0.0.1:8000/api/admin/getTripCompanyDetails?id=" + id)
        .then((response) => response.data)
        .then((data) => {
          setdata(data.data);
          setid(id);
        });
    } else {
      await axios
        .get("http://127.0.0.1:8000/api/trip/getTripCompanyDetails", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("_auth")}`,
          },
        })
        .then((response) => response.data)
        .then((data) => {
          setdata(data.data);
          setid(data.data.id);
        });
    }
  }
  useEffect(() => {
    getUsers();
  }, []);

  async function getTrip() {
    await axios
      .get(
        "http://127.0.0.1:8000/api/admin/getTripsForCompany?page=" +
          pageOffset +
          "&&id=" +
          id
      )
      .then((response) => response.data)
      .then((data) => {
        setTrip(data.data.data);
        setPageCount(data.data.last_page);
      });
  }

  useEffect(() => {
    getTrip();
  }, [pageOffset, id]);

  const handlePageChange = (event, page) => {
    setPageOffset(page);
  };

  if (data === "") {
    return (
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <h3>No Information Your Company</h3>
        <Box
          className="deletebutoomShow edit"
          backgroundColor="#9E9E9E"
          onClick={async () => {
            navigate("/dashTrip/addTrip", {
              state: data,
            });
          }}
        >
          Add Trip
        </Box>
      </Box>
    );
  }
  return (
    data.admin && (
      <Box>
        <div className="dashboardshow">
          <ul className="table trip">
            <li>
              <h6>Name </h6> <h6>{data.name}</h6>
            </li>
            {/* <li>
              <h6>City </h6> <h6>{data.city.name}</h6>
            </li> */}
            <li>
              <h6>Email </h6> <h6>{data.email}</h6>
            </li>
            {/* <li>
              <h6>Location </h6> <h6>{data.location}</h6>
            </li> */}
            <li>
              <h6>Phone Number </h6> <h6>{data.phone_number}</h6>
            </li>
            <li>
              <h6>Admin: </h6> <h6>{data.admin.user_name}</h6>
            </li>
            <li style={{ overflow: "hidden" }}>
              <h6>Trips: </h6>
              <Box borderRadius="30px" width="80%">
                {trip && (
                  <Box
                    backgroundColor={colors.primary[400]}
                    p="10px 15px"
                    alignItems={"center"}
                    textAlign={"center"}
                  >
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(7, 10%)"
                      borderBottom={`1px solid ${colors.primary[800]}`}
                      p="10px "
                      gap="20px"
                    >
                      <Box color={colors.greenAccent[500]}>
                        <Typography>id</Typography>
                      </Box>
                      <Box color={colors.grey[100]}>
                        <Typography>description</Typography>
                      </Box>
                      <Box color={colors.grey[100]}>
                        <Typography>start_age</Typography>
                      </Box>
                      <Box color={colors.grey[100]}>
                        <Typography>end_age</Typography>
                      </Box>
                      <Box color={colors.grey[100]}>
                        <Typography>max_persons</Typography>
                      </Box>
                      <Box color={colors.grey[100]}>
                        <Typography>rate</Typography>
                      </Box>
                      <Box color={colors.grey[100]}>
                        <Typography>days_number</Typography>
                      </Box>
                    </Box>
                    {trip.map((e, i) => (
                      <Link
                        to={`/dash/tripDetails`}
                        state={{ trip: e }}
                        key={`${e.id}-${i}`}
                      >
                        <Box
                          display="grid"
                          gridTemplateColumns="repeat(7, 10%)"
                          borderBottom={`1px solid ${colors.primary[800]}`}
                          p="10px "
                          gap="20px"
                        >
                          <Box color={colors.greenAccent[500]}>
                            <Typography>{e.id}</Typography>
                          </Box>
                          {}
                          <Box color={colors.grey[100]}>
                            <Typography>{e.description}</Typography>
                          </Box>
                          <Box color={colors.grey[100]}>
                            <Typography>{e.start_age}</Typography>
                          </Box>
                          <Box color={colors.grey[100]}>
                            <Typography>{e.end_age}</Typography>
                          </Box>
                          <Box color={colors.grey[100]}>
                            <Typography>{e.max_persons}</Typography>
                          </Box>
                          <Box color={colors.grey[100]}>
                            <Typography>{e.rate}</Typography>
                          </Box>
                          <Box color={colors.grey[100]}>
                            <Typography>{e.days_number}</Typography>
                          </Box>
                        </Box>
                      </Link>
                    ))}
                    <Pagination
                      count={pageCount}
                      size="small"
                      onChange={handlePageChange}
                      className="pagination-container"
                    />
                  </Box>
                )}
              </Box>
            </li>
          </ul>
        </div>

        <Box
          sx={{
            display: "flex",
            padding: "0px 50px 50px 50px ",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Box
            className="deletebutoomShow"
            onClick={() => {
              axios.get(
                "http://127.0.0.1:8000/api/admin/deleteTheCompany?id=" + data.id
              );
              navigate("/dash/company");
            }}
          >
            Delete
          </Box>
          <Box
            className="deletebutoomShow edit"
            backgroundColor="#9E9E9E"
            onClick={async () => {
              if (location.state)
                navigate("/dash/editTrip", {
                  state: data,
                });
              else
                navigate("/dashTrip/editTrip", {
                  state: data,
                });
            }}
          >
            Edit
          </Box>
        </Box>
      </Box>
    )
  );
}

export default ShowTrip;
