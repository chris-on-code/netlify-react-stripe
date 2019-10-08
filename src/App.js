import React from 'react';
import IdentityModal, {
  useIdentityContext,
  IdentityContextProvider
} from 'react-netlify-identity-widget';
import 'react-netlify-identity-widget/styles.css';

function App() {
  const identity = useIdentityContext();
  const [dialog, setDialog] = React.useState(false);

  console.log(identity);

  // get access on how to drink scotch
  // 1. pour in cup
  // 2. drink it

  const name =
    (identity &&
      identity.user &&
      identity.user.user_metadata &&
      identity.user.user_metadata.full_name) ||
    'NoName';
  const avatar_url =
    identity &&
    identity.user &&
    identity.user.user_metadata &&
    identity.user.user_metadata.avatar_url;

  return (
    <div>
      hello all friends
      {identity && identity.isLoggedIn ? (
        <>
          <h1> hello {name}!</h1>
          {avatar_url && (
            <img
              alt="user name"
              src={avatar_url}
              style={{ height: 100, borderRadius: '50%' }}
            />
          )}
          <button
            className="btn"
            style={{ maxWidth: 400, background: 'orangered' }}
            onClick={() => setDialog(true)}
          >
            LOG OUT
          </button>
        </>
      ) : (
        <>
          <h1> hello! try logging in! </h1>
          <button
            className="btn"
            style={{ maxWidth: 400, background: 'darkgreen' }}
            onClick={() => setDialog(true)}
          >
            LOG IN
          </button>
        </>
      )}
      <IdentityModal
        showDialog={dialog}
        onCloseDialog={() => setDialog(false)}
        onLogin={user => console.log('hello ', user)}
        onSignup={user => console.log('welcome ', user)}
        onLogout={() => console.log('bye ', name)}
      />
    </div>
  );
}

export default function() {
  return (
    <IdentityContextProvider url={'https://netlify-react-stripe.netlify.com'}>
      <App />
    </IdentityContextProvider>
  );
}
