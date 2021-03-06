const {
  TextField,
  List,
  ListItem,
  ListDivider,
  Divider,
  Paper,
  RaisedButton,
  CardMedia,
  CardTitle,
  FontIcon,
  Avatar
} = mui;

const styles = {
  textfield: {
    marginLeft: 20
  },
  buttonContainer: {
    'display': 'flex'
  },
  button: {
    margin: "0, auto",
    'paddingLeft': '15px',
    'paddingRight': '15px',
    'width': '50%',
    display: "block"
  },
  image: {
    display: "block",
    width: 300,
    height: 200,
    margin: "0 auto"
  }
};


CaseFileView = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      caseFile: CaseFiles.findOne({_id: this.props.oid })
    };
  },
  getInitialState() {
    // this will set init state, used only for UI updates
    return {
      imageSrc: "/imgs/paperCut.jpg",
      'showDialog': false
    };
  },
  onSubmitTap(e) {
    console.log('submit opinion');
    var shouldSeeDoctor = true;
    // set should see doctor based on which button was tapped
    if (e.target.textContent === 'Yes'){
      shouldSeeDoctor = true;
    } else {
      shouldSeeDoctor = false;
    }
    // check if doctor already made opinion
    // if doctor made opinion, perform update
    Meteor.call('saveOpinion', this.props.oid, Meteor.userId(), this.state.opinion, shouldSeeDoctor);

    // attach doctor to opinion
    // route back to list of opinion
    FlowRouter.go('CaseFilesList');
  },
  onOpinionChange(e) {
    this.setState({opinion: e.target.value});
  },
  // set the opinion information after being tapped to pass to dialog
  onOpinionTap(opinion) {
    // change prop state to open
    this.setState({dialogText: opinion.text});
    this.setState({dialogTitle: 'Contact the Dr.'});
    this.showDialog();
    // this.refs.doctorInfo.setProps({'open': true});
  },
  showDialog(){
    if (this.refs.doctorInfo.refs.doctorInfoDialog) {
      // open dialog
      this.refs.doctorInfo.refs.doctorInfoDialog.show();
    }
  },
  renderOpinionSubmit(){
    // only doctors can submit an opinion
    if (Roles.userIsInRole(Meteor.userId(), 'doctor')) {
      return (
        <div>
          <TextField
            hintText="Enter your opinion of the diagnosis for what may have occured"
            floatingLabelText="Diagnostic Opinion"
            multiLine={true}
            onChange={this.onOpinionChange}
            fullWidth={true}
            rows={3}
          />
          <div style={styles.buttonContainer}>
            <RaisedButton label="Yes"
              primary={true}
              style={styles.button}
              onTouchTap={this.onSubmitTap}
            />
            <RaisedButton label="No"
              primary={false}
              style={styles.button}
              onTouchTap={this.onSubmitTap}
            />
          </div>
        </div>
      );
    }
  },
  opinionSummary(shouldSeeDoctor){
    if (shouldSeeDoctor) {
      return "It's my professional opinion that you see a Doctor immediately";
    } else {
      return "Everything is ok, there is no need to see a doctor at this time";
    }
  },
  renderOpinions(){
    // doctors shouldn't see other's opinions
    if (!Roles.userIsInRole(Meteor.userId(), 'doctor') &&
        this.data.caseFile.opinions) {
      return this.data.caseFile.opinions.map((opinion) => {
        // get a repeatable random color in rgb format
        let cssColor = Utils.generateColor(opinion.doctor._id.toString());
        let avatarStyle = {
          'backgroundColor': cssColor
        };
        // render each opinion
        return (
          <div
            test="test"
          >
          <ListDivider />
          <ListItem 
            onTouchTap={() => this.onOpinionTap(opinion)}
            primaryText={this.opinionSummary(opinion.shouldSeeDoctor)}
            leftAvatar={
            <Avatar 
              style={avatarStyle}
              icon={<FontIcon className="fa fa-user-md" />}
            />}
            />
          </div>
        );
      });
    }
  },
  render() {
    return (
      <div>
        <CardMedia
          overlay={<CardTitle title="" subtitle={this.data.caseFile.description}/>}
        >
          <img src={this.data.caseFile.image}/>
        </CardMedia>
        {this.renderOpinionSubmit()}
        {this.renderOpinions()}
        <DoctorInfo
          ref="doctorInfo"
          open={false}
          bodyText={this.state.dialogText}
          opinionText={this.state.dialogText}
          titleText={this.state.dialogTitle}
        />
      </div>
    );
  }
});
