import React, { useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StyleIcon from "@mui/icons-material/Style";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { TagsAtom } from "./SigmaAtom";

export default function Tags() {
  const [tagInput, setTagInput] = useState("");
  const setTags = useSetRecoilState(TagsAtom);
  const tags = useRecoilValue(TagsAtom);

  const listStyle = {
    marginLeft: "20px",
  };

  const handleTagInput = (event) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    const updatedTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(updatedTags);
  };

  return (
    <>
      <Divider>
        <Chip
          icon={<StyleIcon />}
          label="Tags"
          style={{ fontSize: "20px", padding: "10px", height: "40px" }}
        />
      </Divider>

      <Card
        variant="outlined"
        key={"sigma_rule_card"}
        sx={{
          m: 1,
          mb: 3,
          p: 2,
          borderRadius: 5,
          boxShadow: 0,
          height: "100%",
        }}
      >
        <CardContent sx={{ "& > *": { my: 2 } }}>
          <Typography>
            Use tags from MITRE ATT&CK, CAR and tags for CVE numbers. Examples
            tags:
          </Typography>
          <ul style={listStyle}>
            <li>attack.credential_access </li>
            <li>attack.t1003.002 </li>
            <li>car.2013-07-001 </li>
            <li>cve.2020.10189 </li>
          </ul>
          <Typography>
            Use lower-case tags only. Use . or - as divider in tag names.
            Replace space with an underscore _
          </Typography>
          <div>
            <TextField
              label="Enter tags"
              value={tagInput}
              onChange={handleTagInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTag();
                }
              }}
              size="medium"
              sx={{ width: "100%", mt: 2 }}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="text"
                    disableElevation
                    size="medium"
                    onClick={handleAddTag}
                    startIcon={<AddCircleIcon />}
                    sx={{ width: "20%" }}
                  >
                    Add tag
                  </Button>
                ),
              }}
            />

            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                style={{ marginBottom: "5px" }}
                deleteIcon={<DeleteIcon />}
                sx={{
                  margin: "5px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
