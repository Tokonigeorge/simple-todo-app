import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { userService } from '../services/api';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initializing: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  initializing: true,
};

export const persistUser = createAsyncThunk(
  'user/persistUser',
  async (user: User) => {
    const savedUser = await userService.saveUser(user);
    return savedUser;
  }
);

export const loadUser = createAsyncThunk(
  'user/loadUser',
  async (uid: string) => {
    const user = await userService.getUserByUid(uid);
    return user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: User) => {
    const updatedUser = await userService.updateUser(user.uid, user);
    return updatedUser;
  }
);

export const removeUser = createAsyncThunk(
  'user/removeUser',
  async (uid: string) => {
    await userService.deleteUser(uid);
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setInitializing: (state, action) => {
      state.initializing = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(persistUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(persistUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(persistUser.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to persist user';
      state.loading = false;
    });
    builder.addCase(loadUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(loadUser.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to load user';
      state.loading = false;
    });
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to update user';
      state.loading = false;
    });
    builder.addCase(removeUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeUser.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
    });
    builder.addCase(removeUser.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to remove user';
      state.loading = false;
    });
  },
});

export const { setUser, setInitializing } = userSlice.actions;
export default userSlice.reducer;
