import axios from "axios";
import moment from "moment";

const baseInvitationURL = "http://localhost:3000/calendarinvite/";
const baseURL = "http://localhost:51044/api/";

const APIService = {
  async getUserByEmail(tokenResponse, email) {
    var userToken = Promise.resolve(tokenResponse);
    return userToken.then(async function (idToken) {
      const response = await axios.get(baseURL + "user/email/" + email, {
        headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
      });
      if (response.status === 200) {
        return { status: 200, data: response.data };
      }
    });
  },
  async getUserById(tokenResponse, userId) {
    var userToken = Promise.resolve(tokenResponse);
    return userToken.then(async function (idToken) {
      const response = await axios.get(baseURL + "user/" + userId, {
        headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
      });
      if (response.status === 200) {
        return { status: 200, data: response.data };
      }
    });
  },
  async postUser(tokenResponse, name, email, fUID, created) {
    var userToken = Promise.resolve(tokenResponse);
    return userToken.then(async function (idToken) {
      const response = await axios.post(
        baseURL + "user/",
        {
          Name: name,
          Email: email,
          FireBaseUID: fUID,
          CreateDate: created,
        },
        {
          headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
        }
      );
      if ((response.status = 201)) {
        return { status: 201, data: response.data };
      }
    });
  },
  async getCalendars(tokenResponse, userId) {
    var userToken = Promise.resolve(tokenResponse);
    return userToken.then(async function (idToken) {
      const response = await axios.get(baseURL + "calendars/" + userId, {
        headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
      });
      if (response.status === 200) {
        return { status: 200, data: response.data };
      }
    });
  },
  async getUserCalendar(tokenResponse, calendarId) {
    var userToken = Promise.resolve(tokenResponse);

    return userToken.then(async function (idToken) {
      const response = await axios.get(
        baseURL + "calendars/calendar/" + calendarId,
        {
          headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
        }
      );
      if (response.status === 200) {
        return { status: 200, data: response.data };
      }
    });
  },
  async getUnavailabilities(tokenResponse, calendarId, duration, userIds) {
    var userToken = Promise.resolve(tokenResponse);

    return userToken.then(async function (idToken) {
      const response = await axios.get(
        baseURL +
          "calendars/calendar/" +
          calendarId +
          "/unavailability/" +
          duration +
          "/" +
          userIds,
        {
          headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
        }
      );
      if (response.status === 200) {
        return { status: 200, data: response.data };
      }
    });
  },
  async getAvailabilityRanges(tokenResponse, calendarId, duration, userIds) {
    var userToken = Promise.resolve(tokenResponse);

    return userToken.then(async function (idToken) {
      const response = await axios.get(
        baseURL +
          "calendars/calendar/" +
          calendarId +
          "/availabilityrange/" +
          duration +
          "/" +
          userIds,
        {
          headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
        }
      );
      if (response.status === 200) {
        return { status: 200, data: response.data };
      }
    });
  },
  async getAvailability(tokenResponse, calendarId, duration, userIds) {
    var userToken = Promise.resolve(tokenResponse);

    return userToken.then(async function (idToken) {
      const response = await axios.get(
        baseURL +
          "calendars/calendar/" +
          calendarId +
          "/availability/" +
          duration +
          "/" +
          userIds,
        {
          headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
        }
      );
      if (response.status === 200) {
        return { status: 200, data: response.data };
      }
    });
  },
  async getUsersByCalendar(tokenResponse, calendarId) {
    var userToken = Promise.resolve(tokenResponse);

    return userToken.then(async function (idToken) {
      const response = await axios.get(
        baseURL + "user/calendar/" + calendarId,
        {
          headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
        }
      );
      if (response.status === 200) {
        return { status: 200, data: response.data };
      }
    });
  },
  async postCalendar(
    tokenResponse,
    calendarName,
    userId,
    selectedDays,
    startDate,
    endDate
  ) {
    var userToken = Promise.resolve(tokenResponse);

    return userToken.then(async function (idToken) {
      const response = await axios.post(
        baseURL + "calendars/calendar/" + userId,
        {
          Name: calendarName,
          StartMonth: startDate,
          EndMonth: moment(endDate).format("YYYY-MM-DD"),
          UnavailabilitiesDates: selectedDays,
        },
        {
          headers: { Authorization: `Bearer ${idToken.refreshedToken.token}` },
        }
      );
      if (response.status === 201) {
        return { status: 201, data: response.data };
      }
    });
  },
  invitationLink(calendarId) {
    return baseInvitationURL + calendarId;
  },
  async getInviteCalendar(calendarId) {
    return await axios.get(baseURL + "invite/calendar/" + calendarId);
  },
  async postInviteUser(calendarId, name, email, selectedDays) {
    const response = await axios.post(baseURL + "invite/" + calendarId, {
      Name: name,
      Email: email,
      UnavailabilitiesDates: selectedDays,
    });

    if (response.status === 201) {
      return { status: 201, data: response.data };
    }
  },
  async getInviteCalendarUnavailability(calendarId, duration, userIds) {
    const response = await axios.get(
      baseURL +
        "invite/calendar/" +
        calendarId +
        "/unavailability/" +
        duration +
        "/" +
        userIds
    );

    if (response.status === 200) {
      return { status: 200, data: response.data };
    }
  },
  async getInviteUsersByCalendar(calendarId) {
    return await axios.get(baseURL + "invite/user/calendar/" + calendarId);
  },
  async getInvitedAvailabilityRanges(calendarId, duration, userIds) {
    const response = await axios.get(
      baseURL +
        "invite/calendar/" +
        calendarId +
        "/availabilityrange/" +
        duration +
        "/" +
        userIds
    );
    if (response.status === 200) {
      return { status: 200, data: response.data };
    }
  },
  async getInvitedAvailability(calendarId, duration, userIds) {
    const response = await axios.get(
      baseURL +
        "invite/calendar/" +
        calendarId +
        "/availability/" +
        duration +
        "/" +
        userIds
    );
    if (response.status === 200) {
      return { status: 200, data: response.data };
    }
  },
  async addNotifications(calendarId, userId) {
    const response = await axios.post(
      baseURL + "notification/" + userId + "/" + calendarId
    );
    if (response.status === 201) {
      return { status: 201, data: response.data };
    }
  },
  async getNotifications(userId) {
    const response = await axios.get(baseURL + "notification/" + userId);
    if (response.status === 200) {
      return { status: 200, data: response.data };
    }
  },
  async updateNotifications(userId, notificationKey) {
    const response = await axios.put(
      baseURL + "notification/" + userId + "/" + notificationKey
    );
    if ((response.status = 200)) {
      return { status: 200, data: response.data };
    }
  },
  async getNotificationKey(userId) {
    const response = await axios.get(
      baseURL + "notification/notificationkey/" + userId
    );
    if ((response.status = 200)) {
      return { status: 200, data: response.data };
    }
  },
};

export default APIService;
