import {createSlice} from '@reduxjs/toolkit';

interface SidebarState {
    isOpen: Boolean;
}

const initialState: SidebarState = {
    isOpen: false,
}

const sidebarSlice = createSlice({
    name:"sidebar",
    initialState,
    reducers:{
        openMenu:(state) =>{
            state.isOpen = true;
        },
        closeMenu: (state) =>{
            state.isOpen = false;
        },
        toggleMenu: (state) =>{
            state.isOpen = !state.isOpen;
        },
    },
});

export const {openMenu, closeMenu, toggleMenu} = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;