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
    function changeShow() {
        if (props.show === 'show') {
            props.setShow('hide');
        } else {
            props.setShow('show');
        }
    }

    return (
        <>
        <div id="new-post-div" className={props.show}>
            <div className="container" id="new-post-form" onClick={changeShow}>
                <form action="#" method="POST">
                    <input type="hidden" name="_token" value={props.csrf_token} />
                    <input type="submit" value="Upload"/>
                </form>
            </div>
        </div>
        </>
    )
}