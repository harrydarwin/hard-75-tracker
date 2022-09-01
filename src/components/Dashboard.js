import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { auth, db, logout, getDownloadURL, storage, ref } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Player from './Player';
import Header from './Header';
import AddPlayerForm from './AddPlayerForm';
import Logo from "./Logo";

function Dashboard({ players, goal, highscore, changeScore, removePlayer, addPlayer, currentUser, getPlayers, fLogout, getQuote }) {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");

    const navigate = useNavigate();
    const fetchUserName = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const doc = await getDocs(q);
            console.log(doc, user, user.uid)
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");

        console.log(storage)

        getPlayers();
        fetchUserName();
    }, [user, loading]);
    return (
        <div className="dashboard  w-100">
            <div className="row nav-bar justify-content-between">
                <div className="col-3 d-flex justify-content-center align-items-center">
                    <img src="https://firebasestorage.googleapis.com/v0/b/hard-5e427.appspot.com/o/gg-logo.png?alt=media&token=8ef4fa9e-e374-4b74-b358-15a29163be58" alt="" />
                </div>
                <div className="menu col-9">
                    <div className="dash-container dashboard__container d-flexalign-items-center">
                        <p className="me-2">{getQuote()} {name}</p>
                        {/* <div>{name}</div>
                        <div>{user?.email}</div> */}
                        <button className="dashboard__btn" onClick={fLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="scoreboard">
                <Header
                    title="GM - 75 Hard"
                    players={players}
                />

                {/* Players list */}
                {players.map((player, index) =>
                    <Player
                        name={player.name}
                        score={player.score}
                        goal={goal}
                        id={player.uid}
                        player={player}
                        key={player.uid}
                        index={index}
                        attempts={player.attempts}
                        currentPlayer={currentUser}
                        isHighscore={highscore === player.score}
                        changeScore={changeScore}
                        removePlayer={removePlayer}
                    />
                )}

                <AddPlayerForm
                    addPlayer={addPlayer}
                    currentPlayer={currentUser}
                />
            </div>
        </div>
    );
}
export default Dashboard;