function NewPostBtn(props) {
    const [brand, setBrand] = React.useState('Network');

    function changeBrand() {
        if (brand === 'Network') {
            setBrand('New Post');
        } else {
            setBrand('Network');
        }
    }

    function changeShow() {
        if (props.show === '') {
            props.setShow('show');
        } else if (props.show === 'hide') {
            props.setShow('show');
        } else {
            props.setShow('hide');
        }
    }

    if (props.authenticated) {
        return (<>
            <div className="brand"  onMouseEnter={changeBrand} onMouseLeave={changeBrand} onClick={changeShow}>
                    <button id="new-post-btn"><i className="fa-sharp fa-solid fa-pen-fancy" id="pen-icon">{brand}</i></button>
            </div>
            </>
            )
    } else {
        return (<>
            <div className="brand">
                    <button id="new-post-btn"><i className="fa-sharp fa-solid fa-pen-fancy" id="pen-icon">{brand}</i></button>
            </div>
            </>
            )
    }
}

function NewPost(props) {
    const [post, setPost] = React.useState(null)
    const [content, setContent] = React.useState("")
    function changeShow() {
        if (props.show === 'show') {
            props.setShow('hide');
        } else {
            props.setShow('show');
        }
    }

    function handleSubmit(event){
        event.preventDefault();
        fetch('/post', {
            method: 'POST',
            body: JSON.stringify({
                content: content
            })
        })
        .then(response => response.json())
        .then(result =>{
            setPost(result);
        })
        .catch(error => {
            alert(error);
        })

        const timeoutId = setTimeout(() => {
            setPost(null);
          }, 2000);

          return () => clearTimeout(timeoutId);

    }

    function changeContent(event) {
        setContent(event.target.value)
    }

    function PostMessage() {
        if (post === null) {
            return <></>
        } else {
            return (
            <div className={post.type} id="post-alert">
            {post.message}
            </div>
            )
        }
    }

    return (
        <>
        <div id="new-post-div" className={props.show}>
            <div className="container py-5" id="new-post-container">
                <div className="p-2 d-inline-flex"id="new-post-back-btn" onClick={changeShow}>
                    <span><i className="fa-sharp fa-solid fa-arrow-left"></i></span>
                </div>
                <form id="new-post-form" onSubmit={handleSubmit}>
                    <PostMessage />
                <div className="mb-3">
                    <label htmlFor="new-post-textarea" className="form-label title"><span>NEW POST</span></label>
                    <textarea className="form-control" id="new-post-textarea" rows="3" onChange={changeContent}></textarea>
                </div>
                <div className="d-inline-flex brand">
                    <input className="submit-btn" type="submit" value="POST"/>
                </div>
                </form>
            </div>
        </div>
        </>
    )
}
