import "../node_modules/jquery/dist/jquery.min.js";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

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
/*
    <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Enable both scrolling & backdrop</button>

                <div className="offcanvas offcanvas-start" data-bs-scroll="true" tabIndex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">Backdrop with scrolling</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <p>Try scrolling the rest of the page to see this option in action.</p>
                </div>
                </div>*/

return (
    <>
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
                <a className="nav-link" href="#">Features</a>
                <a className="nav-link" href="#">Pricing</a>
                <a className="nav-link disabled" aria-disabled="true">Disabled</a>
            </div>
            </div>
        </div>
        </nav>
        </>
)
        
const UsePost = () => {
    const [message, setMessage] = React.useState(null)

    React.useEffect(() => {
        fetch('/post', {
            method: 'POST',
            body: JSON.stringify({
                content: 'hello'
            })
        })
        .then(response => response.json())
        .then(result => {
            setMessage(result)
        })
        .catch(error => {
            alert(error);
        })
    }, [])

    console.log(message);

    return null;

}

{
    list && list.map((item) => {
        if (item == props.currentPage) {
            return( <li key ={item} className="page-item active" aria-current="page">
                <span className="page-link">
                  <span>{item}</span>
                  <span className="sr-only">(current)</span>
                </span>
              </li>)
        } else {
            return <li key={item} className="page-item" data-page={item} onClick={pageChanger}><a className="page-link"><span>{item}</span></a></li>
        }
    })
}

<div className="post-card"key={item.id}>
                    <div className="card text-bg-dark mb-3">
                        <div className="card-header row">
                            <div className="col-8" data-filter={item.poster} onClick={userProfile}>{item.poster}</div> 
                            <div className="col-4 text-right">
                                <EditButton edit={props.username === item.poster} />
                                </div>
                            </div>
                        <div className="card-body">
                          <p className="card-text">{item.content}</p>
                          <footer className="blockquote-footer text-info"><small>{item.timestamp}</small></footer>
                        </div>
                      </div>
                    </div>

/* 
REQUIREMENTS:

New Post: 
    -Users who are signed in should be able to write a new text-based post 
    by filling in text into a text area and then clicking a button to submit the post.
    (DONE)

    -The screenshot at the top of this specification shows the “New Post” box at the top of the “All Posts” page. 
    You may choose to do this as well, or you may make the “New Post” feature a separate page. (DONE)

All Posts: 
    -The “All Posts” link in the navigation bar should take the user to a page where they can see all posts from all users, 
    with the most recent posts first.
    (DONE)

    Each post should include 
    -the username of the poster (DONE), 
    -the post content itself (DONE), 
    -the date and time at which the post was made (DONE), 
    - and the number of “likes” the post has (this will be 0 for all posts until you implement the ability to “like” a post later).
    (NOT DONE- to do with like button)

Profile Page: 
    -Clicking on a username should load that user’s profile page. 
    This page should:
        -Display the number of followers the user has (DONE), 
        -as well as the number of people that the user follows (DONE).
        -Display all of the posts for that user, in reverse chronological order (DONE).

        -For any other user who is signed in, this page should also display a “Follow” or “Unfollow” button
         that will let the current user toggle whether or not they are following this user’s posts. 
         Note that this only applies to any “other” user: a user should not be able to follow themselves.
        (DONE)

Following: 
    -The “Following” link in the navigation bar should take the user to a page 
    where they see all posts made by users that the current user follows.
    This page should behave just as the “All Posts” page does, just with a more limited set of posts.
    This page should only be available to users who are signed in.
    (DONE)

Pagination: 
    - On any page that displays posts, posts should only be displayed 10 on a page. 
    If there are more than ten posts, a “Next” button should appear to take the user to the next page of posts 
    (which should be older than the current page of posts). 
    If not on the first page, a “Previous” button should appear to take the user to the previous page of posts as well.
    (TO CHANGE THE NUMBER OF DISPLAYED POST TO 10 AFTER DEBUG)
    (DONE)

Edit Post: 
    -Users should be able to click an “Edit” button or link on any of their own posts to edit that post.
    (DONE)
    -When a user clicks “Edit” for one of their own posts, 
    the [[ content of their post should be replaced with a textarea ]] where the user can edit the content of their post.
    (DONE)
    -The user should then be able to “Save” the edited post. 
    Using JavaScript, you should be able to achieve this without requiring a reload of the entire page.
    (DONE)
    -For security, ensure that your application is designed such that it is not possible for a user, via any route, to edit another user’s posts.
    (DONE)

“Like” and “Unlike”: 
    -Users should be able to click a button or link on any post to toggle whether or not they “like” that post.
    Using JavaScript, you should asynchronously let the server know to update the like count (as via a call to fetch) 
    and then update the post’s like count displayed on the page, without requiring a reload of the entire page.
    (NOT YET)


EXTRA TODO:
    -
*/