function LoadPost(props) {

    const Filter = React.useCallback(() => {
        switch(true) {
            case props.filter === 'following':
                return <>
                <PostTitle filter={props.filter.toUpperCase()} />
                <FetchPage filter={props.filter} page={props.page} changePage={props.changePage} username={props.username}/>
                </>
            case props.filter !== 'all':
                return <>
                <PostTitle filter={props.filter} />
                <Profile username={props.filter} />
                <FetchPage filter={props.filter} page={props.page} changePage={props.changePage} username={props.username}/>
                </>

            default:
                return <>
                <PostTitle filter={props.filter} />
                <FetchPage filter={props.filter} page={props.page} changePage={props.changePage} username={props.username}/>
                </>
        }
    });

    return (
        <div className="container post-div">
        {Filter()}
        </div>
    )
}

function FollowBtn(props) {
    const followUrl = `follow/${props.username}`;
    const [follow, setFollow] = React.useState(null);

    React.useEffect(() => {
        fetch(followUrl)
        .then(response => response.json())
        .then(result => {
            setFollow(result)
        })
        .catch(error => {
            alert(error);
        })
    }, [followUrl]);

    function changeFollowStatus() {
        fetch(followUrl, {
            method: 'POST'
        })
        .then(response => {
            if (response.status === 200) {
                response.json().then(result => {
                    setFollow(!follow)
                    props.setProfile({
                        ...props.profile,
                        "followers": result.followers,
                        "following": result.following
                    })
                }).catch(error => {
                    alert(error)
                })
            } else if (response.status === 400) {
                response.json().then(result => {
                    alert(result.message)
                    setFollow("None")
                }).catch(error => {
                    alert(error)
                })
            } else {
                alert("BAD REQUEST")
                setFollow("None")
            }
        })

    }


    if (follow === "None") {
        console.log('None test')
        return <></>
    } else {
        return(
            <div className="d-inline-flex" onClick={changeFollowStatus}>
                <span className="submit-btn text-center pt-1">{follow ? "unfollow": "follow"}</span>
            </div>
        )
    }

}

function Profile(props) {
    /* Display the number of followers the user has, as well as the number of people that the user follows.*/
    const url = `profile/${props.username}`
    const [profile, setProfile] = React.useState({
        'followers': null,
        'following': null,
        'addFollowBtn': false
    })

    React.useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(result => {
            setProfile({
                'followers': result.followers,
                'following': result.following,
                'addFollowBtn':result.addFollowBtn
            })
        })
    }, [url]);

    function FollowNum() {
        return(
            <>
            <div className="row follow-row px-2 py-3">
                <div className="col follow-col">
                    <span className="follow">followers {profile && profile.followers}</span>
                </div>
                <div className="col">
                    <span className="follow">following {profile && profile.following}</span>
                </div>
            </div>
            </>
        )
    }

    /*For any other user who is signed in, this page should also display a “Follow” or “Unfollow” button 
    that will let the current user toggle whether or not they are following this user’s posts. 
    Note that this only applies to any “other” user: a user should not be able to follow themselves.*/

    if (profile && profile.addFollowBtn) {
        return(
            <>
            <FollowBtn username={props.username} profile={profile} setProfile={setProfile}/>
            < FollowNum />
            </>
        )
    } else {
        return (
            <>
            <FollowNum />
            </>
        )

    }
}

function PostTitle(props) {
    return (<>
    <div className="title">
        <span>{props.filter === 'all' ? 'ALL POSTS':props.filter}</span>
    </div>
        </>
    )
}

const UseFetchPage =(url) => {
    const [pageList, setPageList] = React.useState({
        'pagination': {},
        'error_content': null,
        'object_list': null,
        'error': false,
        'empty': false
    });

    React.useEffect(() => {
        fetch(url)
        .then(response => {
            if (response.status === 200){
            return response.json().then(result => {
                if (result === 'None') {
                    setPageList({
                        'pagination': null,
                        'object_list': null,
                        'empty': true,
                        'error': false,
                        'error_content': null
                    })
                }
                else{
                    setPageList({
                        'pagination': result,
                        'object_list': result.object_list,
                        'empty': false,
                        'error': false,
                        'error_content': null
                    })
                }
            })
            .catch(error => {
                alert(error)
            });
            }
            else if (response.status === 400){
                return response.json().then(result => {
                    setPageList({
                        ...pageList,
                        'pagination': null,
                        'object_list': null,
                        'empty': true,
                        'error_content': result,
                        'error': true
                    })
                });
            }
            else {
                alert('bad request');
                setPageList({
                    ...pageList,
                    'pagination': null,
                    'object_list': null,
                    'empty': true,
                    'error_content':{
                        'type': 'danger',
                        'message': 'BAD REQUEST'
                    },
                    'error': true
                })
            }
            
        })
    }, [url]);

    return pageList;

}

function LikeBtn ({ authenticated }) {
    const [toggleLike, setToggleLike] = React.useState('')

    const classList = `like-btn ${toggleLike}`

    function changeLike() {
        if (toggleLike === 'like') {
            setToggleLike('unlike')
        } else {
            setToggleLike('like')
        }
    }

    const [likeNum, setLikeNum] = React.useState(0);

    /*React.useEffect(() => {
        fetch(followUrl)
        .then(response => response.json())
        .then(result => {
            setFollow(result)
        })
        .catch(error => {
            alert(error);
        })
    }, [followUrl]);*/

    return (
        <>
        <div className="container mt-1 text-right">
            <span className={classList} onClick={authenticated ? changeLike:null}>
                <i className="fa-solid fa-heart"> 100</i>
            </span>
        </div>
        </>
    )
}

function PostDisplay ({ item, changePage, username }) {
    const [editDisplay, setEditDisplay] = React.useState(false);
    const [contentDisplay, setContentDisplay] = React.useState(item.content)
    const editedText = React.useRef();

    function allowEdit() {
        if (editDisplay) {
            setEditDisplay (false)
        } else {
            setEditDisplay(true);
        }
    }

    function EditButton({edit}) {
        if (edit) {
            return (
                <>
                <button className="edit-btn" onClick={allowEdit}>EDIT</button></>
            )
        } else {
            return <></>
        }
    }

    function userProfile(event) {
        changePage({
            'filter': event.currentTarget.dataset.filter,
            'page': 1
        })

        history.pushState({
            filter: event.currentTarget.dataset.filter, page: 1
        }, "", `${event.currentTarget.dataset.filter}=1`)
    }

    function handleEditSubmit(event) {
        event.preventDefault();

        const newText = editedText.current.value;

        if (newText.trim() !== '') {
            fetch(`edit/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    content: newText
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.error) {
                    alert(result.message)
                } else {
                    setContentDisplay(result.message)
                    setEditDisplay(false);
                }
            })
            .catch(error => {
                alert(error);
            })
        } else {
            return false
        }
    }

    function ContentDisplay() {
        if (editDisplay) {
            return (
                <>
                <form className="editing-form" onSubmit={handleEditSubmit}>
                <div className="mb-3">
                    <textarea
                    className="form-control edit-textarea"
                    rows="3"
                    ref={editedText}
                    defaultValue={item.content}
                    ></textarea>
                </div>
                <input className="edit-btn" type="submit" value="SAVE" />
                </form>
            </>
            )
        } else {
            return (
                <p className="card-text">{contentDisplay}</p>
            )
        }
    }

    return (
            <div className="card text-bg-dark mb-3">
                <div className="card-header row">
                    <div className="col-8" data-filter={item.poster} onClick={userProfile}>{item.poster}</div> 
                    <div className="col-4 text-right">
                        <EditButton edit={username === item.poster} />
                        </div>
                    </div>
                <div className="card-body">
                    <ContentDisplay />
                    <footer className="blockquote-footer text-info">
                        <small>{item.timestamp}</small>
                        < LikeBtn authenticated={username} id={item.id}/>
                        </footer>
                </div>
                </div>
    )
}

function FetchPage(props) {
    let url = `page/${props.filter}/${props.page}`
    const pageList = UseFetchPage(url);

    if (pageList.error) {
        return (   
            <>
            <ShowAlertBox type={pageList.error_content && pageList.error_content.type} message={pageList.error_content && pageList.error_content.message}/>
        </>
        )
    }
    else {
        if (pageList.empty) {
            return (
                <EmptyPost filter={props.filter} />
            )
        }
        return (<>
            {
                pageList.object_list && pageList.object_list.map((item) => {
                    return (
                        <div className="post-card"key={item.id}>
                            <PostDisplay item={item} changePage={props.changePage} username={props.username}/>
                        </div>
                )
                })
            }
            < Pagination pagination={pageList.pagination} currentPage={props.page} changePage={props.changePage} filter={props.filter}/>
            </>
        )
    } 
    
}

function Pagination(props) {

    function pageChanger(event) {
        props.changePage({
            'filter': props.filter,
            'page': event.currentTarget.value
        })

        history.pushState({
            filter: props.filter, 
            page: event.currentTarget.value
        }, "", `${props.filter}=${event.currentTarget.value}`)
    }
    function PageNumber() {
        let list = Array(props.pagination.num_pages).fill().map((_, index) => index + 1);
        
        return (
            <>
            <select onChange={pageChanger} 
            value={props.currentPage}>
                {
                    list && list.map((item) => {
                        return(
                            <option key={item} value={item} className="page-option">
                                {item}
                            </option>
                        )
                    })
                }
            </select>

            </>
        )

    }

    function PrevNextBtn({ name, show }) {
        if (show) {
            return (
                <li className="page-item">
                <button 
                className="page-link"
                value={name === "Previous" ? (parseInt(props.currentPage) - 1):(parseInt(props.currentPage) + 1)} 
                onClick={pageChanger}>
                    <span>{name}</span>
                </button>
            </li>
            )
        } else {
            return <></>
        }
    }

    return (
        <>
        <nav aria-label="posts-pagination">
            <ul className="pagination">
            < PrevNextBtn name='Previous' show={props.pagination.has_previous}/>
              < PageNumber />
              < PrevNextBtn name='Next' show={props.pagination.has_next}/>
            </ul>
          </nav>
        </>
    )
}

function ShowAlertBox(props) {
    let type = `alert alert-${props.type} text-center py-5`
    return(
        <div className={type} role="alert">
            {props.message}
          </div>
    )
}

function EmptyPost(props) {
    const empty_page_content = {
        'heading': 'Nothing to see here.',
        'following':{
            'first_line': 'You are not following anybody right now.',
            'second_line': 'Click on the username on the top of each post to view the user.'
        },
        'user': {
            'first_line': 'You have not made any post',
            'second_line': 'Click the new post button on the top left to make one.'
        }
    }
    return (<div className="m-3">
        <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">{empty_page_content.heading}</h4>
            <p>{props.filter === 'following' ? empty_page_content.following.first_line : empty_page_content.user.first_line}</p>
            <hr></hr>
            <p className="mb-0">{props.filter === 'following' ? empty_page_content.following.second_line : empty_page_content.user.second_line}</p>
          </div>
        </div>
    )
}

