function LoadPost(props) {
    const Filter = React.useCallback(() => {
        switch(true) {
            case props.filter === 'following':
                return <>
                <PostTitle filter={props.filter.toUpperCase()} />
                <FetchPage filter={props.filter} page={props.page} changePage={props.changePage}/>
                </>
            case props.filter !== 'all':
                return <>
                <PostTitle filter={props.filter} />
                <Profile username={props.filter}/>
                <FetchPage filter={props.filter} page={props.page} changePage={props.changePage}/>
                </>

            default:
                return <>
                <PostTitle filter={props.filter} />
                <FetchPage filter={props.filter} page={props.page} changePage={props.changePage}/>
                </>
        }
    });

    return (
        <div className="container post-div">
        {Filter()}
        </div>
    )
}

const UseFetchProfile = (url) => {
    const [profile, setProfile] = React.useState(null)

    React.useEffect(() => {
        fetch(url)
        .then(response => response.json())
        .then(result => {
            setProfile(result)
        })
    }, [url]);

    return profile
}

function FollowBtn(props) {
    const [x, setX] = React.useState(false)

    function changeX() {
        if (x) {
            setX(false)
        } else {
            setX(true)
        }
    }

    console.log(x);
    if (x) {
        return(
            <div onClick={changeX}>ALREADY FOLLOWED, UNFOLLOW?</div>
        )
    } else {
        return(
        <div onClick={changeX}>WANT TO FOLLOW?</div>
        )
    }
}

function Profile(props) {
    /* Display the number of followers the user has, as well as the number of people that the user follows.*/
    
    let url = `profile/${props.username}`
    const profile = UseFetchProfile(url);

    function FollowNum() {
        return(
            <>
            <h1>followers {profile && profile.followers}</h1>
            <h1>following {profile && profile.following}</h1>
            </>
        )
    }

    /*For any other user who is signed in, this page should also display a “Follow” or “Unfollow” button 
    that will let the current user toggle whether or not they are following this user’s posts. 
    Note that this only applies to any “other” user: a user should not be able to follow themselves.*/

    if (profile && profile.addFollowBtn) {
        return(
            <>
            <FollowBtn username={props.username}/>
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

function FetchPage(props) {
    let url = `page/${props.filter}/${props.page}`
    const pageList = UseFetchPage(url);

    function userProfile(event) {
        props.changePage({
            'filter': event.currentTarget.dataset.filter,
            'page': 1
        })

        history.pushState({
            filter: event.currentTarget.dataset.filter, page: 1
        }, "", `${event.currentTarget.dataset.filter}=1`)
    }

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
                    return <div key={item.id}>
                    <div className="card text-bg-dark mb-3">
                        <div className="card-header" data-filter={item.poster} onClick={userProfile}>{item.poster}</div>
                        <div className="card-body">
                          <p className="card-text">{item.content}</p>
                          <footer className="blockquote-footer text-info"><small>{item.timestamp}</small></footer>
                        </div>
                      </div>
                    </div>
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

    return (
        <>
        <nav aria-label="posts-pagination">
            <ul className="pagination">
              <li className="page-item">
                <button 
                className="page-link"
                disabled={!props.pagination.has_previous}
                value={props.pagination.has_previous ? (parseInt(props.currentPage) - 1):1} 
                onClick={pageChanger}>
                    <span className={props.pagination.has_previous ? "":"disabled"}>Previous</span>
                    </button>
              </li>
              < PageNumber />
              <li className={props.pagination.has_next ? "page-item":"page-item disabled"}>
                <button 
                className="page-link" 
                value={props.pagination.has_next ? (parseInt(props.currentPage) + 1):props.pagination.num_pages} 
                disabled={!props.pagination.has_next}
                onClick={pageChanger}>
                    <span>Next</span>
                    </button>
              </li>
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

