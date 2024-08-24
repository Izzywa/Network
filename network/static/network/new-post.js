function NewPostBtn(props) {
    const [brand, setBrand] = React.useState('Network')

    function changeBrand() {
        if (brand === 'Network') {
            setBrand('New Post');
        } else {
            setBrand('Network');
        }
    }
    return (<>
    <div className="brand"  onMouseEnter={changeBrand} onMouseLeave={changeBrand}>
            <button id="new-post-btn"><i className="fa-sharp fa-solid fa-pen-fancy" id="pen-icon">{brand}</i></button>
        </div>
    </>
    )
}
