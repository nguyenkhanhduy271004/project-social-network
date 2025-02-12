import { Grid } from '@mui/material'
import React from 'react'
import Navigation from '../Navigation/Navigation'
import HomeSection from '../HomeSection/HomeSection'
import RightPart from '../RightPart/RightPart'
import { Routes, Route } from 'react-router-dom'
import Profile from '../Profile/Profile'

function HomePage() {
    return (
        <Grid container xs={12} className='px-5 lg:px-36 justify-between'>
            <Grid item={0} lg={2.5} className='hidden lg:block w-full relative '>
                <Navigation />
            </Grid>
            <Grid item={12} lg={6} className='hidden lg:block w-full relative '>
                <Routes>
                    <Route path="/" element={<HomeSection />} />
                    <Route path="/home" element={<HomeSection />} />
                    <Route path="/account" element={<Profile />} />
                </Routes>
            </Grid>
            <Grid item={0} lg={3} className='hidden lg:block w-full relative '>
                <RightPart />
            </Grid>
        </Grid>
    )
}

export default HomePage
