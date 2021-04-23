import firebase from "../firebase";

const FirebaseService = {
  async createUserWithEmailAndPassword(email, password) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (result) => {
        return result;
      });
  },
  async signInWithEmailAndPassword(email, password) {
    const response = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (result) => {
        return result;
      });
    return response;
  },
  userToken(refresh = false) {
    try {
      return firebase
        .auth()
        .currentUser.getIdTokenResult(refresh)
        .then((token) => {
          return { status: 200, refreshedToken: token };
        })
        .catch((err) => {
          console.error(err);
          return { status: 500, refreshedToken: null };
        });
    } catch (exc) {
      console.error("ERROR DURING TOKEN REFRESH");
      return { status: 404, refreshedToken: null };
    }
  },
  userLogout() {
    firebase.auth().signOut();
  },
};

export default FirebaseService;
