import { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Check input validity
  useEffect(() => {
    setIsSubmitDisabled(credential.length < 4 || password.length < 6);
  }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

  // Demo user login handler
  const handleDemoLogin = (e) => {
    e.preventDefault();
    return dispatch(
      sessionActions.login({
        credential: "Demo-lition",
        password: "password",
      })
    ).then(closeModal);
  };

  return (
    <div className="login-modal">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p className="error">{errors.credential}</p>}
        <button type="submit" disabled={isSubmitDisabled}>
          Log In
        </button>
        <button onClick={handleDemoLogin} className="demo-login-button">
          Log in as Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
