import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import { useModal } from "../../context/Modal";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Reset form to initial state
  const resetForm = () => {
    setEmail("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setIsSubmitDisabled(true);
  };

  // Validate form inputs
  useEffect(() => {
    const validateForm = () => {
      const isAnyFieldEmpty =
        !email ||
        !username ||
        !firstName ||
        !lastName ||
        !password ||
        !confirmPassword;

      const isUsernameTooShort = username.length < 4;
      const isPasswordTooShort = password.length < 6;

      setIsSubmitDisabled(
        isAnyFieldEmpty || isUsernameTooShort || isPasswordTooShort
      );
    };

    validateForm();
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      }));
      return;
    }

    return dispatch(
      sessionActions.signup({
        email,
        username,
        firstName,
        lastName,
        password,
      })
    )
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
  };

  // Reset form when modal closes
  useEffect(() => {
    return () => resetForm();
  }, []);

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
        </label>
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        </label>
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </label>
        {errors.username && <p className="error">{errors.username}</p>}

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>
        {errors.password && <p className="error">{errors.password}</p>}

        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <button type="submit" disabled={isSubmitDisabled}>
          Sign Up
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
