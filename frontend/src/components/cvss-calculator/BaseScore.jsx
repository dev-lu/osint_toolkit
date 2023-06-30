import React, { useState } from "react";
import { useRecoilState } from "recoil";

import { cvssScoresAtom } from "./CvssScoresAtom";
import Circle from "./Circle";

import BarChartIcon from "@mui/icons-material/BarChart";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import InfoModal from "./InfoModal";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

export default function BaseScore() {
  const theme = useTheme();
  const [cvssScores, setCvssScores] = useRecoilState(cvssScoresAtom);
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(null);
  const [modalText, setModalText] = useState(null);

  const handleOpenModal = (title, text) => {
    setModalTitle(title);
    setModalText(text);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setModalTitle(null);
    setModalText(null);
    setOpenModal(false);
  };

  return (
    <>
      <br />
      <Divider>
        <Chip
          icon={<BarChartIcon />}
          label="Base Score Metrics (required)"
          style={{ fontSize: "20px", padding: "10px", height: "40px" }}
        />
      </Divider>
      <br />
      <Grid
        direction="row"
        container
        spacing={2}
        sx={{ alignItems: "stretch" }}
      >
        <Card
          elevation={0}
          sx={{
            m: 2,
            p: 2,
            borderRadius: 5,
            flex: 1,
            minWidth: 0,
            backgroundColor: theme.palette.background.cvssCard,
          }}
        >
          <p>
            The Base metric group represents the intrinsic characteristics of a
            vulnerability that are constant over time and across user
            environments. It is composed of two sets of metrics: the
            Exploitability metrics and the Impact metrics. The Exploitability
            metrics reflect the ease and technical means by which the
            vulnerability can be exploited. That is, they represent
            characteristics of the thing that is vulnerable, which we refer to
            formally as the vulnerable component. On the other hand, the Impact
            metrics reflect the direct consequence of a successful exploit, and
            represent the consequence to the thing that suffers the impact,
            which we refer to formally as the impacted component.
          </p>
        </Card>
        <Card
          elevation={0}
          sx={{
            mb: 2,
            mt: 2,
            p: 2,
            borderRadius: 5,
            minWidth: 0,
            backgroundColor: theme.palette.background.cvssCard,
          }}
        >
          {" "}
          <div
            style={{
              width: "120px",
              height: "120px",
              alignItems: "center",
              backgroundColor: theme.palette.background.cvssCircle,
              borderRadius: "50%",
            }}
          >
            <Circle value={cvssScores.base.baseScore} />
          </div>
          <Typography
            variant="h6"
            fontWeight={cvssScores.base.baseScore >= 9.0 ? "bold" : "normal"}
            color={
              cvssScores.base.baseScore >= 7.0
                ? "red"
                : cvssScores.base.baseScore >= 4.0
                ? "orange"
                : "green"
            }
            align="center"
            gutterBottom
            sx={{ display: "block", marginBottom: 1 }}
          >
            {cvssScores.base.baseScore >= 9.0
              ? "Critical"
              : cvssScores.base.baseScore >= 7.0
              ? "High"
              : cvssScores.base.baseScore >= 4.0
              ? "Medium"
              : cvssScores.base.baseScore === 0
              ? "None"
              : "Low"}
          </Typography>
        </Card>
      </Grid>

      <Card
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 5,
          minWidth: 0,
          backgroundColor: theme.palette.background.cvssCard,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h6" align="center">
              Exploitability Metrics (Score:{" "}
              {Math.round(cvssScores.base.exploitabilityScore * 10) / 10})
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                select
                fullWidth
                label="Attack Vector (AV)"
                value={cvssScores.base.attackVector}
                onChange={(e) =>
                  setCvssScores((prevCvssScores) => ({
                    ...prevCvssScores,
                    base: {
                      ...prevCvssScores.base,
                      attackVector: e.target.value,
                    },
                  }))
                }
                sx={{ m: 1 }}
              >
                <MenuItem value="N">Network</MenuItem>
                <MenuItem value="A">Adjacent Network</MenuItem>
                <MenuItem value="L">Local</MenuItem>
                <MenuItem value="P">Physical</MenuItem>
              </TextField>
              <IconButton
                onClick={() =>
                  handleOpenModal(
                    "Attack Vector (AV)",
                    "The Attack Vector (AV) metric measures the context by which a vulnerability is exploited. The more remote the attack, the higher the value of AV. The AV metric is based on the assumption that an attacker who can exploit the vulnerability must be able to reach the vulnerable component."
                  )
                }
              >
                <InfoIcon />
              </IconButton>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                select
                fullWidth
                label="Attack Complexity (AC)"
                value={cvssScores.base.attackComplexity}
                onChange={(e) =>
                  setCvssScores((prevCvssScores) => ({
                    ...prevCvssScores,
                    base: {
                      ...prevCvssScores.base,
                      attackComplexity: e.target.value,
                    },
                  }))
                }
                sx={{ m: 1 }}
              >
                <MenuItem value="L">Low</MenuItem>
                <MenuItem value="H">High</MenuItem>
              </TextField>
              <IconButton
                onClick={() =>
                  handleOpenModal(
                    "Attack Complexity (AC)",
                    "This metric describes the conditions beyond the attacker’s control that must exist in order to exploit the vulnerability. As described below, such conditions may require the collection of more information about the target, or computational exceptions. Importantly, the assessment of this metric excludes any requirements for user interaction in order to exploit the vulnerability (such conditions are captured in the User Interaction metric). If a specific configuration is required for an attack to succeed, the Base metrics should be scored assuming the vulnerable component is in that configuration. The Base Score is greatest for the least complex attacks."
                  )
                }
              >
                <InfoIcon />
              </IconButton>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                select
                fullWidth
                label="Privileges Required (PR)"
                value={cvssScores.base.privilegesRequired}
                onChange={(e) =>
                  setCvssScores((prevCvssScores) => ({
                    ...prevCvssScores,
                    base: {
                      ...prevCvssScores.base,
                      privilegesRequired: e.target.value,
                    },
                  }))
                }
                sx={{ m: 1 }}
              >
                <MenuItem value="N">None</MenuItem>
                <MenuItem value="L">Low</MenuItem>
                <MenuItem value="H">High</MenuItem>
              </TextField>
              <IconButton
                onClick={() =>
                  handleOpenModal(
                    "Privileges Required (PR)",
                    "This metric describes the level of privileges an attacker must possess before successfully exploiting the vulnerability. The Base Score is greatest if no privileges are required."
                  )
                }
              >
                <InfoIcon />
              </IconButton>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                select
                fullWidth
                label="User Interaction (UI)"
                value={cvssScores.base.userInteraction}
                onChange={(e) =>
                  setCvssScores((prevCvssScores) => ({
                    ...prevCvssScores,
                    base: {
                      ...prevCvssScores.base,
                      userInteraction: e.target.value,
                    },
                  }))
                }
                sx={{ m: 1 }}
              >
                <MenuItem value="N">None</MenuItem>
                <MenuItem value="R">Required</MenuItem>
              </TextField>
              <IconButton
                onClick={() =>
                  handleOpenModal(
                    "User Interaction (UI)",
                    "This metric captures the requirement for a human user, other than the attacker, to participate in the successful compromise of the vulnerable component. This metric determines whether the vulnerability can be exploited solely at the will of the attacker, or whether a separate user (or user-initiated process) must participate in some manner. The Base Score is greatest when no user interaction is required."
                  )
                }
              >
                <InfoIcon />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" align="center">
              Impact Metrics (Score:{" "}
              {Math.round(cvssScores.base.impactScore * 10) / 10})
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                select
                fullWidth
                label="Confidentiality Impact (C)"
                value={cvssScores.base.confidentialityImpact}
                onChange={(e) =>
                  setCvssScores((prevCvssScores) => ({
                    ...prevCvssScores,
                    base: {
                      ...prevCvssScores.base,
                      confidentialityImpact: e.target.value,
                    },
                  }))
                }
                sx={{ m: 1 }}
              >
                <MenuItem value="N">None</MenuItem>
                <MenuItem value="L">Low</MenuItem>
                <MenuItem value="H">High</MenuItem>
              </TextField>
              <IconButton
                onClick={() =>
                  handleOpenModal(
                    "Confidentiality Impact (C)",
                    "This metric measures the impact to the confidentiality of the information resources managed by a software component due to a successfully exploited vulnerability. Confidentiality refers to limiting information access and disclosure to only authorized users, as well as preventing access by, or disclosure to, unauthorized ones. The Base Score is greatest when the loss to the impacted component is highest."
                  )
                }
              >
                <InfoIcon />
              </IconButton>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                select
                fullWidth
                label="Integrity Impact (I)"
                value={cvssScores.base.integrityImpact}
                onChange={(e) =>
                  setCvssScores((prevCvssScores) => ({
                    ...prevCvssScores,
                    base: {
                      ...prevCvssScores.base,
                      integrityImpact: e.target.value,
                    },
                  }))
                }
                sx={{ m: 1 }}
              >
                <MenuItem value="N">None</MenuItem>
                <MenuItem value="L">Low</MenuItem>
                <MenuItem value="H">High</MenuItem>
              </TextField>
              <IconButton
                onClick={() =>
                  handleOpenModal(
                    "Integrity Impact (I)",
                    "This metric measures the impact to integrity of a successfully exploited vulnerability. Integrity refers to the trustworthiness and veracity of information. The Base Score is greatest when the consequence to the impacted component is highest."
                  )
                }
              >
                <InfoIcon />
              </IconButton>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                select
                fullWidth
                label="Availability Impact (A)"
                value={cvssScores.base.availabilityImpact}
                onChange={(e) =>
                  setCvssScores((prevCvssScores) => ({
                    ...prevCvssScores,
                    base: {
                      ...prevCvssScores.base,
                      availabilityImpact: e.target.value,
                    },
                  }))
                }
                sx={{ m: 1 }}
              >
                <MenuItem value="N">None</MenuItem>
                <MenuItem value="L">Low</MenuItem>
                <MenuItem value="H">High</MenuItem>
              </TextField>
              <IconButton
                onClick={() =>
                  handleOpenModal(
                    "Availability Impact (A)",
                    "This metric measures the impact to the availability of the impacted component resulting from a successfully exploited vulnerability. While the Confidentiality and Integrity impact metrics apply to the loss of confidentiality or integrity of data (e.g., information, files) used by the impacted component, this metric refers to the loss of availability of the impacted component itself, such as a networked service (e.g., web, database, email). Since availability refers to the accessibility of information resources, attacks that consume network bandwidth, processor cycles, or disk space all impact the availability of an impacted component. The Base Score is greatest when the consequence to the impacted component is highest."
                  )
                }
              >
                <InfoIcon />
              </IconButton>
            </div>
          </Grid>
          <div style={{ margin: "auto", width: "40%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                select
                fullWidth
                label="Scope (S)"
                value={cvssScores.base.scope}
                onChange={(e) =>
                  setCvssScores((prevCvssScores) => ({
                    ...prevCvssScores,
                    base: {
                      ...prevCvssScores.base,
                      scope: e.target.value,
                    },
                  }))
                }
                sx={{ m: 1 }}
              >
                <MenuItem value="U">Unchanged</MenuItem>
                <MenuItem value="C">Changed</MenuItem>
              </TextField>
              <IconButton
                onClick={() =>
                  handleOpenModal(
                    "Scope (S)",
                    "The Scope metric captures whether a vulnerability in one vulnerable component impacts resources in components beyond its security scope. Formally, a security authority is a mechanism (e.g., an application, an operating system, firmware, a sandbox environment) that defines and enforces access control in terms of how certain subjects/actors (e.g., human users, processes) can access certain restricted objects/resources (e.g., files, CPU, memory) in a controlled manner. All the subjects and objects under the jurisdiction of a single security authority are considered to be under one security scope. If a vulnerability in a vulnerable component can affect a component which is in a different security scope than the vulnerable component, a Scope change occurs. Intuitively, whenever the impact of a vulnerability breaches a security/trust boundary and impacts components outside the security scope in which vulnerable component resides, a Scope change occurs. The security scope of a component encompasses other components that provide functionality solely to that component, even if these other components have their own security authority. For example, a database used solely by one application is considered part of that application’s security scope even if the database has its own security authority, e.g., a mechanism controlling access to database records based on database users and associated database privileges. The Base Score is greatest when a scope change occurs."
                  )
                }
              >
                <InfoIcon />
              </IconButton>
            </div>
          </div>
        </Grid>
      </Card>
      {openModal && (
        <InfoModal
          open={openModal}
          onClose={handleCloseModal}
          title={modalTitle}
          text={modalText}
        />
      )}
    </>
  );
}
