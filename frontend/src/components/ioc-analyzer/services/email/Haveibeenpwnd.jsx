import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from '@mui/material/Divider';

import ResultRow from "../../ResultRow";


export default function Haveibeenpwnd(props) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          "http://localhost:8000/api/" +
          props.type +
          "/haveibeenpwnd/" +
          encodeURIComponent(props.email);
        const response = await axios.get(url);
        setResult(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const details = (
    <>
      {result ? (
        <Box sx={{ margin: 1 }}>
          <Card
            variant="outlined"
            key="hibp_breaches"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <h3>Breaches</h3>
            {result.breachedaccount && result.breachedaccount.length > 0 ? (
              result.breachedaccount.map((account) => (
                <>
                  {account.Name && <><b>Name: </b> {account.Name}<br /></>}
                  {account.Title && <><b>Title: </b> {account.Title}<br /></>}
                  {account.Domain && <><b>Domain: </b> {account.Domain}<br /></>}
                  {account.BreachDate && <><b>Breach date: </b> {account.BreachDate}<br /></>}
                  {account.BreachDate && <><b>Breach date: </b> {account.BreachDate}<br /></>}
                  {account.AddedDate && <><b>Added date: </b> {account.AddedDate}<br /></>}
                  {account.ModifiedDate && <><b>Modified date: </b> {account.ModifiedDate}<br /></>}
                  {account.IsMalware && <><b>Breach is sourced from malware: </b> {account.IsMalware}<br /></>}
                  {account.IsSpamList && <><b>Is a spam list: </b> {account.IsSpamList}<br /></>}
                  {account.IsFabricated && <><b>Is fabricated: </b> {account.IsFabricated}<br /></>}
                  <br />
                  <Divider />
                  <br />
                </>
              ))
            ) : (
              <p>No breaches found</p>
            )}
          </Card>
          <Card
            variant="outlined"
            key="hibp_pastes"
            sx={{ m: 1, p: 2, borderRadius: 5, boxShadow: 0 }}
          >
            <h3>Pastes</h3>
            {result.pasteaccount && result.pasteaccount.length > 0 ? (
              result.pasteaccount.map((paste) => (
                <>
                  {paste.Title && <><b>Title: </b> {paste.Title}<br /></>}
                  {paste.Source && <><b>Source: </b> {paste.Source}<br /></>}
                  {paste.Date && <><b>Date: </b> {paste.Date}<br /></>}
                  {paste.EmailCount && <><b>Email count: </b> {paste.EmailCount}<br /></>}
                  <br />
                  <Divider />
                  <br />
                </>
              ))
            ) : (
              <p>No pastes found</p>
            )}
          </Card>
        </Box>
      ) : null}
    </>
  )

  return (
    <>
      <ResultRow
        name="Have I Been Pwned"
        id="hibp"
        icon="hibp_logo_small"
        loading={loading}
        result={result}
        summary={
          result && (
            (result.pasteaccount && result.pasteaccount.length > 0) ||
              (result.breachedaccount && result.breachedaccount.length > 0)
              ? <>{(result.breachedaccount ? result.breachedaccount.length : 0)} Breaches and {(result.pasteaccount ? result.pasteaccount.length : 0)} Pastes found </>
              : <>No pastes or breaches found</>
          )}


        summary_color={{ color: null }}
        color={
          result && (
            (result.pasteaccount && result.pasteaccount.length > 0) ||
              (result.breachedaccount && result.breachedaccount.length > 0)
              ? (result.breachedaccount ? "orange" : "green")
              : "green"
          )}
        error={error}
        details={details}
      />
    </>
  )
}
