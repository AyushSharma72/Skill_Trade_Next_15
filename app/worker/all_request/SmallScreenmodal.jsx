"use client";
import React from "react";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Modal from "@mui/material/Modal";
import Slider from "@mui/material/Slider";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { marks, style } from "../../_Arrays/Arrays";

const SmallScreenmodal = ({
  open,
  handleClose,
  handleServiceTypeChange,
  ServiceType,
  handleChange,
  Disabled,
  checkedValues,
  distance,
  setDistance,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style} className="w-[350px]">
        <div className="w-full flex flex-col gap-4">
          {/* Service Type */}
          <div>
            <p className="font-semibold text-lg">Service Type</p>
            <Select
              required
              onValueChange={handleServiceTypeChange}
              value={ServiceType}
            >
              <SelectTrigger className="w-full border-gray-300">
                <SelectValue placeholder="Select a Service" />
              </SelectTrigger>
              <SelectContent portal={true} className="z-[1500]">
                <SelectItem value="electrician">Electrician</SelectItem>
                <SelectItem value="carpenter">Carpenter</SelectItem>
                <SelectItem value="plumber">Plumber</SelectItem>
                <SelectItem value="painter">Painter</SelectItem>
                <SelectItem value="gardener">Gardener</SelectItem>
                <SelectItem value="mechanic">Mechanic</SelectItem>
                <SelectItem value="locksmith">Locksmith</SelectItem>
                <SelectItem value="handyman">Handyman</SelectItem>
                <SelectItem value="welder">Welder</SelectItem>
                <SelectItem value="pest_control">Pest Control</SelectItem>
                <SelectItem value="roofer">Roofer</SelectItem>
                <SelectItem value="tiler">Tiler</SelectItem>
                <SelectItem value="appliance_repair">
                  Appliance Repair
                </SelectItem>
                <SelectItem value="flooring_specialist">
                  Flooring Specialist
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => handleServiceTypeChange("")}
              className="mt-2 w-full"
            >
              Clear Filter
            </Button>
          </div>

          {/* Location & Distance */}
          <div className="border-t border-gray-300 pt-4">
            <p className="font-semibold text-lg">Location</p>
            {/* <FormControlLabel
              name="nearBy"
              control={<Checkbox />}
              checked={checkedValues.nearBy}
              onChange={handleChange}
              label="Near By"
            /> */}
            <div className="flex flex-col gap-2 mt-2">
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
                />
              </Box>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setDistance(5)}
              >
                Reset Distance
              </Button>
            </div>

            <FormControlLabel
              name="yourCity"
              control={<Checkbox disabled={Disabled} />}
              checked={checkedValues.yourCity}
              onChange={handleChange}
              label="Your City"
            />
            {Disabled && (
              <p className="text-red-600 text-sm">
                Update your city to enable this filter
              </p>
            )}
          </div>

          {/* Close Button */}
          <Button onClick={handleClose} className="mt-4 w-full">
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default SmallScreenmodal;
