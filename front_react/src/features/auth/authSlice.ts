import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NICKNAME } from '../types';


const apiUrl = process.env.REACT_APP_DEV_API_URL

export const fetchAsyncLogin = createAsyncThunk(
  "auth/post",
  async (authen: PROPS_AUTHEN) => {
    const res = await axios.post(`${apiUrl}authen/jwt/create/`, authen, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsyncRegister = createAsyncThunk(
  "auth/register",
  async (auth: PROPS_AUTHEN) => {
    const res = await axios.post(`${apiUrl}api/register/`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const fetchAsynCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PROPS_NICKNAME) => {
    const res = await axios.post(`${apiUrl}api/profile/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROPS_PROFILE) => {
    const uploadData = new FormData();
    uploadData.append("nockName", profile.nickName);
    profile.img && uploadData.append("img", profile.img.name);
    const res = await axios.put(
      `${apiUrl}api/profile/${profile.id}`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetMyProf = createAsyncThunk("profile/get", async () => {
  const res = await axios.get(`${apiUrl}api/myprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});

export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
  const res = await axios.get(`$apiUrl/api/profile/`, {
    headers: {
      Authorization : `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    openSignIn: true,
    openSignUp: false,
    openProfile: false,
    isLoadingAuth: false,
    myprofile: {
      id: 0,
      nickName: '',
      userProfile: 0,
      created_on: '',
      img: '',
    },
    profiles: [
      {
        id: 0,
        nickName: '',
        userProfile: 0,
        created_on: '',
        img: '',
      },
    ],
  },
  reducers: {
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenSignIn(state) {
      state.openSignIn = true;
    },
    resetOpenSignIn(state) {
      state.openSignIn = false;
    },
    setOpenSignUp(state) {
      state.openSignUp = true;
    },
    resetOpenSignUp(state) {
      state.openSignUp = false;
    },
    setOpenProfile(state) {
      state.openProfile = true;
    },
    resetOpneProfile(state) {
      state.openProfile = false;
    },
    editNickName(state, action) {
      state.myprofile.nickName = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
    });
    builder.addCase(fetchAsynCreateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.profiles = action.payload;
      state.profiles = state.profiles.map((prof) => 
        prof.id === action.payload.id ? action.payload : prof
      );
    });
  },
  
});

export const { 
  fetchCredStart, 
  fetchCredEnd,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile, 
  resetOpneProfile, 
  editNickName
} = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp;
export const selectOpenProfile = (state: RootState) => state.auth.openProfile;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;