"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { Tag } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { TbFilterSearch } from "react-icons/tb";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StyledTableCell,
  StyledTableRow,
  calculateDistance,
  marks,
} from "../../_Arrays/Arrays";
import { GetRequestFilteredData } from "./GetRequestFilteredData";
import RecommadedJobs from "./RecommadedJobs";
import SmallScreennmodal from "./SmallScreenmodal";
import { useAuth } from "@/app/_context/UserAuthContent";


function ViewRequest() {
  const [auth, setauth] = useAuth();
  const [data, setdata] = useState([]);
  const [pages, SetPages] = useState(1);
  const [pageNumber, SetPageNumber] = useState(1);
  const [loading, setloading] = useState(false);
  const [ServiceType, setServiceType] = useState("");
  const [checkedValues, setCheckedValues] = useState({
    nearBy: false,
    yourCity: false,
  });
  const [Disabled, setDisabled] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [WorkerCoordinates, SetWorkerCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [alertshow, Setalertshow] = useState(true);
  const [distance, setDistance] = useState(5); // Default is 5km

  //  get location

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            // Save to localStorage
            localStorage.setItem(
              "userCoordinates",
              JSON.stringify({ latitude, longitude })
            );
          },
          (error) => {
            console.error("Error fetching location:", error.message);
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser.");
      }
    };

    getUserLocation();
    const userCoordinates = JSON.parse(localStorage.getItem("userCoordinates"));
    if (userCoordinates) {
      const latitude = userCoordinates.latitude;
      const longitude = userCoordinates.longitude;
      SetWorkerCoordinates({
        latitude: latitude,
        longitude: longitude,
      });
    } else {
      console.log("No user coordinates found in localStorage.");
    }
  }, []);

  const handleServiceTypeChange = (value) => {
    setServiceType(value);
  };

  const handlePageChange = (event, value) => {
    SetPageNumber(value);
  };

  async function GetData() {
    try {
      setloading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/request/Allrequests/${pageNumber}`
      );
      const info = await response.json();
      if (info.success) {
        setdata(info.requests);
        SetPages(Math.ceil(info?.totalrequests / 5));
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("please try again");
    } finally {
      setloading(false);
    }
  }

  const checkCity = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workers/CheckCity/${auth?.user?._id}`
      );
      const data = await response.json();

      if (data.success) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } catch (error) {
      console.error("Error checking city:", error);
      setDisabled(false);
    }
  };

  async function GetFilteredData() {
    try {
      setloading(true);
      const info = await GetRequestFilteredData(
        ServiceType,
        checkedValues,
        distance,
        auth?.user?._id,
        WorkerCoordinates
      );

      if (info.success) {
        setdata(info.requests);
      } else {
        toast.error(info.message);
      }
    } catch (error) {
      toast.error("please try again");
    } finally {
      setloading(false);
    }
  }

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setCheckedValues((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (
      ServiceType ||
      checkedValues.nearBy ||
      checkedValues.yourCity ||
      distance
    ) {
      GetFilteredData();
      checkCity();
    } else {
      GetData();
      checkCity();
    }
  }, [pageNumber, auth, ServiceType, checkedValues, distance]);

  return (
    <div>
      <Toaster position="bottom-center" reverseOrder={false} />

      <div className="lg:flex lg:flex-row lg:justify-between lg:gap-5 p-5 flex flex-col ">
        {/* Filters */}
        <div className="lg:w-[23%] flex flex-col gap-4 items-start mt-20 sm:mt-0">
          {/* tags */}
          <span
            className="flex sm:hidden lg:flex items-center gap-2 font-bold cursor-pointer sm:pointer-events-none hover:text-blue-600 transition"
            onClick={handleOpen}
          >
            <TbFilterSearch className="text-lg" />
            Apply Filters
            {ServiceType && <Tag color="default">{ServiceType}</Tag>}
            {checkedValues.yourCity && <Tag color="default">YourCity</Tag>}
          </span>

          {/* Small Screen Filter Modal */}
          <SmallScreennmodal
            open={open}
            handleClose={handleClose}
            handleOpen={handleOpen}
            handleServiceTypeChange={handleServiceTypeChange}
            ServiceType={ServiceType}
            handleChange={handleChange}
            Disabled={Disabled}
            checkedValues={checkedValues}
            distance={distance}
            setDistance={setDistance}
          />

          {/* Service Type Filter */}
          <div className="w-full hidden sm:flex flex-col gap-3 p-4 bg-white shadow-md rounded-xl">
            <p className="font-semibold text-gray-700">Service Type</p>
            <Select
              required
              onValueChange={handleServiceTypeChange}
              value={ServiceType}
            >
              <SelectTrigger className="w-full border-gray-300 rounded-lg shadow-sm">
                <SelectValue placeholder="Select a Service" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Electrician",
                  "Carpenter",
                  "Plumber",
                  "Painter",
                  "Gardener",
                  "Mechanic",
                  "Locksmith",
                  "Handyman",
                  "Welder",
                  "Pest Control",
                  "Roofer",
                  "Tiler",
                  "Appliance Repair",
                  "Flooring Specialist",
                ].map((service) => (
                  <SelectItem key={service} value={service.toLowerCase()}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full  rounded-lg transition"
              onClick={() => setServiceType("")}
            >
              Clear Service Filter
            </Button>
          </div>

          {/* Location Filter */}
          <div className="w-full hidden sm:flex flex-col gap-3 p-4 bg-white shadow-md rounded-xl mt-4">
            <p className="font-semibold text-gray-700">Location</p>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">Distance range in kms</p>
              <Box sx={{ width: "100%" }}>
                <Slider
                  aria-label="Distance"
                  value={distance}
                  onChange={(event, newValue) => setDistance(newValue)}
                  valueLabelDisplay="auto"
                  shiftStep={30}
                  step={5}
                  marks={marks}
                  min={0}
                  max={20}
                  sx={{
                    color: "black", // Changes the slider track and thumb to black
                    "& .MuiSlider-thumb": {
                      backgroundColor: "black",
                    },
                    "& .MuiSlider-track": {
                      backgroundColor: "black",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "gray", // Change this if you want a different rail color
                    },
                  }}
                />
              </Box>
            </div>
            <FormControlLabel
              name="yourCity"
              control={<Checkbox disabled={Disabled} />}
              label="Your City"
              checked={checkedValues.yourCity}
              onChange={handleChange}
            />
            {Disabled && (
              <p className="text-sm text-red-500">
                Update your city to enable this filter.
              </p>
            )}
            <Button
              className="w-full  rounded-lg transition"
              onClick={() => {
                setCheckedValues({ nearBy: false, yourCity: false });
                setDistance(5);
              }}
            >
              Clear Location Filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="h-[600px] w-full flex">
            <PulseLoader size={20} className="m-auto" />
          </div>
        ) : data?.length > 0 ? (
          // Requests
          <div className="lg:w-3/4 w-full ">
            <p className="text-3xl text-center sm:mt-3 mt-10 font-bold">
              All Requests
            </p>
            {WorkerCoordinates.latitude && alertshow ? (
              <Alert
                severity="info"
                className="mt-3"
                onClose={() => {
                  Setalertshow(false);
                }}
              >
                You are sharing your location for better search results !
              </Alert>
            ) : alertshow ? (
              <Alert
                severity="info"
                className="mt-3"
                onClose={() => {
                  Setalertshow(false);
                }}
              >
                Allow location in browser site settings to display distance of
                the request location !
              </Alert>
            ) : null}
            <TableContainer className="cursor-pointer mt-2 " component={Paper}>
              <Table aria-label="customized table" sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      Service type
                    </StyledTableCell>
                    <StyledTableCell align="center">Location</StyledTableCell>
                    <StyledTableCell align="center">
                      Visiting Date
                    </StyledTableCell>
                    <StyledTableCell align="center">Status</StyledTableCell>
                    <StyledTableCell align="center">Distance</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((data) => (
                    <StyledTableRow key={data._id}>
                      {/* service type  */}
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {data.service}
                      </StyledTableCell>
                      {/* Location */}
                      <StyledTableCell align="center">
                        {data.location}
                      </StyledTableCell>
                      {/* Visiting Date */}
                      <StyledTableCell align="center">
                        <div className="flex flex-col">
                          <span className="font-bold">
                            {moment(data.date).format("MMMM Do YYYY")}
                          </span>
                        </div>
                      </StyledTableCell>
                      {/* Status */}
                      <StyledTableCell align="center">
                        {data.status === "Pending" ? (
                          <Tag icon={<ClockCircleOutlined />} color="warning">
                            {data.status}
                          </Tag>
                        ) : data.status === "Accepted" ? (
                          <Tag icon={<CheckCircleOutlined />} color="blue">
                            {data.status}
                          </Tag>
                        ) : data.status === "Assigned" ? (
                          <Tag icon={<CheckCircleOutlined />} color="success">
                            {data.status}
                          </Tag>
                        ) : data.status === "Completed" ? (
                          <Tag icon={<CheckCircleOutlined />} color="purple">
                            {data.status}
                          </Tag>
                        ) : data.status === "Deleted" ? (
                          <Tag icon={<CheckCircleOutlined />} color="red">
                            {data.status}
                          </Tag>
                        ) : null}
                      </StyledTableCell>
                      {/* Distance */}
                      <StyledTableCell align="center">
                        {WorkerCoordinates.latitude &&
                        data.coordinates?.coordinates[1] ? (
                          `${calculateDistance(
                            WorkerCoordinates.latitude,
                            WorkerCoordinates.longitude,
                            data.coordinates?.coordinates[1],
                            data.coordinates?.coordinates[0]
                          )} km away`
                        ) : (
                          <span className="text-red-500">not availiable</span>
                        )}{" "}
                      </StyledTableCell>
                      {/* Action */}
                      <StyledTableCell align="center">
                        {
                          <Link href={`Request_Details/${data._id}`}>
                            <Button>View</Button>
                          </Link>
                        }
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {ServiceType ||
            checkedValues.nearBy ||
            checkedValues.yourCity ? null : (
              <Pagination
                className="mt-5 flex justify-center"
                count={pages}
                page={pageNumber}
                color="primary"
                onChange={handlePageChange}
              />
            )}
            <RecommadedJobs />
          </div>
        ) : (
          <div className="sm:w-3/4 flex flex-col justify-center items-center">
            <p className="font-bold text-3xl text-center mt-10">No Data</p>
            <Image
              src="/Empty.svg"
              className="w-[400px] h-[400px] m-auto"
              width={400}
              height={400}
              alt="Empty"
            />
            <Link href="/">
              <Button>Home</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewRequest;
