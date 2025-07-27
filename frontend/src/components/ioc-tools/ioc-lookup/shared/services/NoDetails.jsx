import React from 'react'
import { Card } from '@mui/material'
import { styled } from '@mui/material/styles';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import Divider from '@mui/material/Divider';
import MuiGrid from '@mui/material/Grid';

export default function NoDetails() {
    const Grid = styled(MuiGrid)(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        '& [role="separator"]': {
          margin: theme.spacing(0, 2),
        },
      }));
  return (
    <>
        <Card elevation={0} sx={{ maxWidth: 600, m: 2, p: 2, borderRadius: 2 }}>
            <Grid container>
                <Grid xs item={true} display="flex" justifyContent="center" alignItems="center">
                    <NotInterestedIcon sx={{ fontSize: 80, color: 'lightgrey'}} />
                </Grid>
                <Divider orientation="vertical" flexItem></Divider>
                <Grid xs item={true} sx={{p: 2}}>
                    <h2>No details available</h2>
                    <p>There are no further details availables for this item.</p>
                </Grid>
            </Grid>
        </Card>
    </>
  )
}
