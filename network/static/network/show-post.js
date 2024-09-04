function LoadPost(props) {
    const Filter = React.useCallback(() => {
        switch(true) {
            case props.filter === 'following':
                return <>
                <PostTitle filter={props.filter.toUpperCase()} />
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
                        <div className="card-header">{item.poster}</div>
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
            'page': event.currentTarget.dataset.page
        })
    }
    function PageNumber() {
        let list = Array(props.pagination.num_pages).fill().map((_, index) => index + 1);
        return (
            <>
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
            </>
        )

    }

    return (
        <>
        <nav aria-label="posts-pagination">
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" data-page={props.pagination.has_previous ? (parseInt(props.currentPage) - 1):1} onClick={pageChanger}>
                    <span className={props.pagination.has_previous ? "":"disabled"}>Previous</span>
                    </a>
              </li>
              < PageNumber />
              <li className={props.pagination.has_next ? "page-item":"page-item disabled"}>
                <a className="page-link" data-page={props.pagination.has_next ? (parseInt(props.currentPage) + 1):props.pagination.num_pages} onClick={pageChanger}>
                    <span>Next</span>
                    </a>
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

export default ShowAlertBox
