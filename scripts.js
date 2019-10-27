const root = document.getElementById('root');

const { Component } = React;
const { HashRouter, Route, Link, Switch, Redirect } = ReactRouterDOM;


const Nav = ({ location, companies }) => {
    const { pathname } = location;
    return (
        <nav>
            <Link to=''>Acme Company Profits with React Router</Link>
            <Link to='companies'>Companies ({companies.length})</Link>
        </nav>
    )
}

const Home = () => {
    return (
        <div>
            Welcome!
        </div>
    )
}

const Companies = ({ location, companies }) => {
    const { pathname } = location;
    // console.log(pathname)
    return (
        <div>
            {companies.map((company, idx) => <div key={idx}><Link to={`/companies/${company.id}`}>{company.name}</Link></div>)}
            <Route path='/companies/:id' render = {(props) => <Company {...props} company = { Company } />} />
        </div>
    );
}

class Company extends Component {
    constructor() {
        super()
        this.state = {
            companyInfo: []
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.match.params.id !== this.props.match.params.id) {
            const id = this.props.match.params.id
            axios.get(`https://acme-users-api-rev.herokuapp.com/api/companies/${id}/companyProfits`)
                .then(value => value.data)
                .then(data => this.setState({
                    companyInfo: data
                }))
        }
    }

    componentDidMount(){
        const id = this.props.match.params.id
        axios.get(`https://acme-users-api-rev.herokuapp.com/api/companies/${id}/companyProfits`)
            .then(value => value.data)
            .then(data => this.setState({
                companyInfo: data
            }))
    }

    render() {
        // console.log(this.props.match.params.id)
        const { companyInfo } = this.state
        console.log(companyInfo)
        return (
            <div>
                { companyInfo.map(year => <div className='entry'><div className ='year'>{ year.fiscalYear }</div><div> { year.amount } </div></div>) }
            </div>
        )
    }
}

// eslint-disable-next-line react/no-multi-comp
class App extends Component {
    constructor() {
        super();
        this.state = {
            companies : [],
        }
    }

    componentDidMount() {
        axios.get('https://acme-users-api-rev.herokuapp.com/api/companies')
            .then(values => values.data)
            .then(data => this.setState({
                companies: data
            }))
    }
    render() {
        const { companies } = this.state
        return (
            <HashRouter>
                <Route render = {(props) => <Nav {...props} companies = { companies } />}/>
                <Switch>
                    <Route path='/home' exact component = { Home } />
                    <Route path='/companies' render = {(props) => <Companies {...props} companies = { companies } />}/>
                    {/* <Route path='/companies/:id' component = { Company } /> */}
                    {/* <Route path='/companies/:id' render = {(props) => <Company {...props} company = { Company } />} /> */}
                    <Redirect to='home' />
                </Switch>
            </HashRouter>
        )
    }
}

ReactDOM.render(<App />, root);