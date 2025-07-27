import React from 'react'

import { Card } from '@mui/material'
import Divider from '@mui/material/Divider';
import Grow from '@mui/material/Grow';
import KeyIcon from '@mui/icons-material/Key';
import MuiGrid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';


export default function NoApikeys() {
    const Grid = styled(MuiGrid)(({ theme }) => ({
        width: '100%',
        ...theme.typography.body2,
        '& [role="separator"]': {
          margin: theme.spacing(0, 2),
        },
      }));

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
        <Grow in={true}>
            <Card variant="outlined" elevation={0} sx={{ maxWidth: 800, m: 2, p: 2, borderRadius: 5 }}>
                <Grid container>
                    <Grid xs item={true} display="flex" justifyContent="center" alignItems="center">
                        <KeyIcon sx={{ fontSize: 100, color: 'lightgrey'}} />
                    </Grid>
                    <Divider orientation="vertical" flexItem></Divider>
                    <Grid xs item={true} sx={{p: 2}}>
                        <h2>No API keys available for this action</h2>
                        <p>You need to add API keys in the settings tab, to use this function.</p>
                    </Grid>
                </Grid>
            </Card>
        </Grow>
    </div>
  )
}
