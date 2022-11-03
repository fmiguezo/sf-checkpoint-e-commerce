import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import firebaseApp from '../firebase/firebase';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../firebase/firebase";
import { collection, addDoc, setDoc, doc, getFirestore } from "firebase/firestore";

export const Register = () =>{
  // Firestore Users
  const usersCollection = collection(db, "users");
  const firestore = getFirestore(firebaseApp);

  // Firebase Register auth 
    // const registerUser = async (email, password, role) =>{
    //   const result = await createUserWithEmailAndPassword(
    //     auth,
    //     email,
    //     password
    //     // userCredential created it's not coming from firebase
    //   ).then((userCredential) => {
    //     console.log(userCredential);
    //     return userCredential;
    //   }) 
    // }
    const registerUser = async (email, password, role) => {
      // console.log("registerUser", email, password, role);
      const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
      ).then((userCredential) => {
          // console.log("userCredential", userCredential);
          return userCredential;
      });
      // console.log("result", result);
      // console.log("result.user.uid", result.user.uid);
      const userRef = doc(firestore, `users/${result.user.uid}`);
      // console.log("userRef", userRef);
      // setDoc(userRef, {email: email, role: role})
      setDoc(userRef, { email, role });
  };
    const auth = getAuth(firebaseApp);
    // React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();
    
    const onSubmit = (data, e) => {

      const email = data.email;
      const password = data.password;
      const role = data.role;
      try{
        
        registerUser(email, password, role);
        alert('Creado con exito')
      }catch(error){
        console.log(error);
      }
    }


  //   const addProduct = async (e) =>{
  //     e.preventDefault();
  //     try{
  //         await addDoc(productsCollection, product)
  //         console.log('Producto enviado');
  //     }catch(error){
  //         console.log('Error', error);
  //     }
  // }
   


    return(
    <section >

      <h2 className='d-flex justify-content-center pt-2'>Create a New User</h2>
      <div className='d-flex justify-content-center'>
        {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
        <form className="d-flex flex-column align-items-center border border-primary p-3 rounded-bottom" onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          
          {/* INPUT EMAIL */}
          <label>New Email:</label>
          <input
            className="form__inp"
            type="email"
            placeholder="example@something.com"
            autoComplete="off"
            {...register("email", {
              required: {
                value: true,
                message: "Email is required",
              },
              maxLength: {
                value: 20,
                message: "Field must be less than 20 characters",
              },
            })}
          />

          {/* errors will return when field validation fails  */}
          {errors.email && <span>{errors.email.message}</span>}

          {/* INPUT PASSWORD */}
          <label>Password:</label>
          <input
            className="form__inp"
            type="password"
            placeholder="Create Password"
            autoComplete="off"
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
              maxLength: {
                value: 20,
                message: "Field must be less than 20 characters",
              },
              minLength: {
                value: 6,
                message: "Field must contain more than 6 characters",
              },
            })}
          />
          {errors.password && <span>{errors.password.message}</span>}

          {/* INPUT SELECT */}
          <label>Role</label>
          <select {...register("role",{
            required:{
              value: true,
              message: "Role is required"
            }
          })}>
            <option value="seller">Seller</option>
            <option value="user">User</option>
          </select>

          {/* errors will return when field validation fails  */}
          {errors.role && <span>{errors.role.message}</span>}

          <input className="form__sub__btn" type="submit" value="SIGN UP" />
          <p className="formu__signUp">
            Already have an account?{" "}
            <Link to="/login" className="formu__signUp__link">
              LOG IN
            </Link>
          </p>
        </form>
      </div>
    </section>
    )
}