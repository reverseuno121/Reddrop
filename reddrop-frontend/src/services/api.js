const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";
  
// LOGIN
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};


// REGISTER
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};


// GET DONOR PROFILE
export const getDonorProfile = async (token) => {
  const response = await fetch(`${API_URL}/donor/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch donor profile"
    );
  }

  return data;
};

export const updateDonorProfile = async (token, profileData) => {
  const response = await fetch(
    `${API_URL}/donor/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update donor profile"
    );
  }

  return data;
};


// GET OPEN BLOOD REQUESTS
export const getBloodRequests = async (token) => {
  const response = await fetch(`${API_URL}/blood-requests`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch blood requests"
    );
  }

  return data;
};


// ACCEPT BLOOD REQUEST
export const acceptBloodRequest = async (token, requestId) => {
  const response = await fetch(
    `${API_URL}/blood-requests/${requestId}/accept`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to accept blood request"
    );
  }

  return data;
};


// GET DONOR AVAILABILITY
export const getDonorAvailability = async (token) => {
  const response = await fetch(
    `${API_URL}/donor/availability`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch availability"
    );
  }

  return data;
};


// UPDATE DONOR AVAILABILITY
export const updateDonorAvailability = async (
  token,
  availability
) => {
  const response = await fetch(
    `${API_URL}/donor/availability`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        availability,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update availability"
    );
  }

  return data;
};


// FIND AVAILABLE DONORS
export const findDonors = async (token, filters = {}) => {
  const params = new URLSearchParams();

  if (filters.bloodGroup) {
    params.append("bloodGroup", filters.bloodGroup);
  }

  if (filters.state) {
    params.append("state", filters.state);
  }

  if (filters.district) {
    params.append("district", filters.district);
  }

  if (filters.city) {
    params.append("city", filters.city);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_URL}/recipient/donors${
      queryString ? `?${queryString}` : ""
    }`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to find donors"
    );
  }

  return data;
};

// CREATE BLOOD REQUEST
export const createBloodRequest = async (token, requestData) => {
  const response = await fetch(`${API_URL}/blood-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create blood request"
    );
  }

  return data;
};

// GET RECIPIENT'S BLOOD REQUESTS
export const getMyBloodRequests = async (token) => {
  const response = await fetch(
    `${API_URL}/blood-requests/my-requests`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch your blood requests"
    );
  }

  return data;
};


// CANCEL BLOOD REQUEST
export const cancelBloodRequest = async (token, requestId) => {
  const response = await fetch(
    `${API_URL}/blood-requests/${requestId}/cancel`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to cancel blood request"
    );
  }

  return data;
};

// GET RECIPIENT PROFILE
export const getRecipientProfile = async (token) => {
  const response = await fetch(
    `${API_URL}/recipient/profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch recipient profile"
    );
  }

  return data;
};

// UPDATE RECIPIENT PROFILE
export const updateRecipientProfile = async (
  token,
  profileData
) => {
  const response = await fetch(
    `${API_URL}/recipient/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update recipient profile"
    );
  }

  return data;
};

// GET ADMIN DASHBOARD STATISTICS
export const getAdminDashboardStats = async (token) => {
  const response = await fetch(
    `${API_URL}/admin/dashboard-stats`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch dashboard statistics"
    );
  }

  return data;
};


// GET ALL BLOOD REQUESTS FOR ADMIN
export const getAdminBloodRequests = async (token) => {
  const response = await fetch(
    `${API_URL}/admin/blood-requests`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch blood requests"
    );
  }

  return data;
};

// GET MY DONATION HISTORY
export const getMyDonations = async (token) => {
  const response = await fetch(
    `${API_URL}/donations/my-donations`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch donation history"
    );
  }

  return data;
};


// GET ALL DONATIONS FOR ADMIN
export const getAllDonations = async (token) => {
  const response = await fetch(
    `${API_URL}/donations`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch donations"
    );
  }

  return data;
};

// GET ALL USERS FOR ADMIN
export const getAllUsers = async (token) => {
  const response = await fetch(
    `${API_URL}/admin/users`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch users"
    );
  }

  return data;
};

// GET ALL DONORS FOR ADMIN
export const getAllDonors = async (token) => {
  const response = await fetch(
    `${API_URL}/admin/donors`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch donors"
    );
  }

  return data;
};

// GET BLOOD INVENTORY
export const getBloodInventory = async (token) => {
  const response = await fetch(
    `${API_URL}/inventory`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch blood inventory"
    );
  }

  return data;
};


// UPDATE BLOOD INVENTORY
export const updateBloodInventory = async (
  token,
  bloodGroup,
  unitsAvailable
) => {
  const response = await fetch(
    `${API_URL}/inventory`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bloodGroup,
        unitsAvailable,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update blood inventory"
    );
  }

  return data;
};

export const getAdminProfile = async (token) => {
  const response = await fetch(
    `${API_URL}/admin/profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch admin profile"
    );
  }

  return data;
};

export const updateAdminProfile = async (token, profileData) => {
  const response = await fetch(
    `${API_URL}/admin/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update admin profile"
    );
  }

  return data;
};

//Change Password
export const changePassword = async (
  token,
  currentPassword,
  newPassword
) => {
  const response = await fetch(
    `${API_URL}/auth/change-password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to change password"
    );
  }

  return data;
};

//createDonations
export const createDonation = async (token, donationData) => {
  const response = await fetch(
    `${API_URL}/donations`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(donationData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create donation"
    );
  }

  return data;
};

// ISSUE BLOOD TO RECIPIENT
export const issueBlood = async (token, requestId) => {
  const response = await fetch(
    `${API_URL}/blood-requests/${requestId}/issue`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to issue blood"
    );
  }

  return data;
};