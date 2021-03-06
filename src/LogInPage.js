//import { token } from 'morgan';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Alert from './Alert';



/**Login form
 *
 * Shows form and manages update to state on changes
 * On submission:
 * -calls login function prop
 * -redirects to / route
 *
 * Routes--> LoginPage ---> Alert
 * Routed as /login
 */

function LogIn({ login }){
    const history = useHistory();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [valid, setValid] = useState(false);
    const [token, setToken] = useState(false);

    console.debug(
        'LogInPage',
        'login=', typeof login,
        'formData=', formData,
        'formErrors', formErrors,
    );

    /**Handle form submit
     *
     * Calls login func prop and, if successful,
     * redirects to /
    */

    async function handleSubmit(evt){
        evt.preventDefault();
        let result = await login(formData);
        if (result.success){
            history.push('/');
        }
        else{
            setFormErrors(result.errors);
        }

        const res = fetch("http://localhost:3001/auth/token", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(formData)
        });
        console.log(res);
        history.push('/');
    }

    /**update form data field */
    function handleChange(evt){
        const{ name, value } = evt.target;
        setFormData(l => ({ ...l, [name]: value }));
    }

    return(
        <div className='LogInPage'>
            <div className='container col-md-6 offset-md-3 col-lg-4 offset-lg-4'>
                <h3 className='mb-3'>Log In</h3>
                <div className='card'>
                    <div className='card-body'>
                        <form action="users/token" method="POST" className="login-form" onSubmit={handleSubmit}>
                        {/* {setToken(false) ? <span id="login-error">Incorrect username/password</span> : null} */}
                            <div className='form-group'>
                                <label >Username</label>
                                <input
                                    type='username'
                                    name='username'
                                    className='form-control'
                                    value={formData.username}
                                    onChange={handleChange}
                                    // autoComplete='username'
                                    // required
                                />
                                {submitted && !formData.username ? <span id="username-error">Please enter a username</span> : null}
                            </div>
                            <div className='form-group'>
                                <label>Password</label>
                                <input
                                    type='password'
                                    name='password'
                                    className='form-control'
                                    value={formData.password}
                                    onChange={handleChange}
                                    // autoComplete='current-password'
                                    // required

                                />
                                {submitted && !formData.password ? <span id="password-error">Please enter a password</span> : null}
                            </div>
                            {formErrors.length
                                ? <Alert type='danger' messages={formErrors} />
                                : null}
                            <button
                                className='btn btn-primary float-right'
                                onSubmit={handleSubmit}>
                                    Submit
                                </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default LogIn;
