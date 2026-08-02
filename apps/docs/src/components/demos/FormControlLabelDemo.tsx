"use client";

import CheckBox from "@shpaw415/mui-lite/CheckBox";
import FormControl from "@shpaw415/mui-lite/FormControl";
import FormControlLabel from "@shpaw415/mui-lite/FormControlLabel";
import FormGroup from "@shpaw415/mui-lite/FormGroup";
import FormLabel from "@shpaw415/mui-lite/FormLabel";
import Radio from "@shpaw415/mui-lite/Radio";
import Switch from "@shpaw415/mui-lite/Switch";
import { Demo } from "../Demo";

export function FormControlLabelDemo() {
	return (
		<>
			<Demo title="Checkboxes">
				<FormGroup>
					<FormControlLabel
						control={<CheckBox defaultChecked />}
						label="Gilad Gray"
					/>
					<FormControlLabel control={<CheckBox />} label="Jason Killian" />
					<FormControlLabel disabled control={<CheckBox />} label="Disabled" />
				</FormGroup>
			</Demo>
			<Demo title="Row + Switch">
				<FormGroup row>
					<FormControlLabel control={<Switch defaultChecked />} label="On" />
					<FormControlLabel control={<Switch />} label="Off" />
				</FormGroup>
			</Demo>
			<Demo title="Label placement">
				<FormControl>
					<FormLabel>labelPlacement</FormLabel>
					<FormGroup row>
						<FormControlLabel
							value="top"
							control={<Radio name="placement" />}
							label="Top"
							labelPlacement="top"
						/>
						<FormControlLabel
							value="start"
							control={<Radio name="placement" />}
							label="Start"
							labelPlacement="start"
						/>
						<FormControlLabel
							value="bottom"
							control={<Radio name="placement" />}
							label="Bottom"
							labelPlacement="bottom"
						/>
						<FormControlLabel
							value="end"
							control={<Radio name="placement" />}
							label="End"
							labelPlacement="end"
						/>
					</FormGroup>
				</FormControl>
			</Demo>
		</>
	);
}
