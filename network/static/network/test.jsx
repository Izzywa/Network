
let x;
    {% if user.is_authenticated%}
        x = 1;
    {%else%}
        x = "stranger";
    {%endif%}



    function FetchData(props) {
        const [data, setData] = React.useState(null);
        fetch(props.url)
        .then(response => response.json())
        .then(result => setData(result));

        return (
            <>
            {
                data && data.map((item) => {
                    return <p key={item.id}>{item.poster} posted {item.content}</p>
                })
            }
            </>
        )
    }

    function GetData() {
        const[data, setData] = React.useState(null);
        const [filter, setFilter] = React.useState('following');

        function ChangeFilter() {
            if (filter == 'following') {
                setFilter('all');
            }
            else {
                setFilter('following');
            }
        }

        let url = `posts/${filter}`;

        return (
            <>
            < FetchData url={url}/>
            <button onClick={ChangeFilter}>click me</button>
            </>
        )
    }

    function AllPost() {
        const [something, setSomething] = React.useState({
            text: "something",
            number: 124
        });

        function changeText() {
            setSomething({
                ...something,
                text: "new thing"
            });
            x = 2;
        }

        return (
            <>
            <div>{something.text}, {something.number}, x = {x}</div>
            <button onClick={changeText}>button</button>
            </>
        )
    }

    function Username() {
        {%if user.is_authenticated%}
        return(
            <>
            <strong> {{user.username}}</strong>
            </>
        )
        {%else%}
        return(
            <>
            <strong> stranger</strong>
            </>
        )
        {%endif%}
    }

    function Profile() {
        function al() {
            alert('IT WORKS');
        }
        return (
            <>
            <p onClick={al}>
                Hello 
                < Username/>
            </p>
            </>
        )
    }

    const UserContext = createContext();

    function Component1() {
    const [user, setUser] = React.useState("Jesse Hall");

    return (
        <UserContext.Provider value={user}>
        <h1>{`Hello ${user}!`}</h1>
        </UserContext.Provider>
    );
    }

    function Component2() {
        const user = useContext(UserContext);

        return (
            <>
            <h1>Component 5</h1>
            <h2>{`Hello ${user} again!`}</h2>
            </>
        );

    }

    

    const post = ReactDOM.createRoot(document.querySelector('#post-div'));
    const profile = ReactDOM.createRoot(document.querySelector('#profile-div'));
    const test = ReactDOM.createRoot(document.querySelector('#test-div'));


    post.render(<GetData />);
    profile.render(<Component1 />);
    test.render(<Component2 />);

    function FetchPosts(props) {
        const [data, setData] = React.useState(null);
        const [status, setStatus] = React.useState(null);
        const [error, setError] = React.useState(null);
        let url = `posts/${props.url}`

        React.useEffect(() => {
            fetch(url)
            .then(response => {
                if (response.status === 200){
                    setStatus('ok')
                return response.json()
                }
                else {
                    setStatus('error')
                    return response.json().then(result => {
                        setError(result);
                    });
                }
                
            })
            .then(result => setData(result))
            .catch(error => {
                alert(error)
            });
        }, [props.url]); 
        
        if (status === 'ok') {
            if (data === 'None' && props.url === 'following') {
                return (<EmptyPost filter={props.url}/>)
            } else if (data === 'None' && props.url !== 'following') {
                return (<EmptyPost filter={props.url}/>
                )
            } else {
                return (
                    <>
                    {
                        data && data.map((item) => {
                            return <div key={item.id}>
                            <div className="card text-bg-dark mb-3">
                                <div className="card-header">{item.poster}</div>
                                <div className="card-body">
                                  <p className="card-text">{item.content}</p>
                                  <footer className="blockquote-footer text-info"><small>{item.timestamp}</small></footer>
                                </div>
                              </div>
                            </div>
                        })
                    }
                    </>
                )
            }

        } else {
            return (   
                <>
                <ShowAlertBox type={error && error.type} message={error && error.message}/>
            </>

            )
        }

        
    }