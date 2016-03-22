FlowRouter.route("/", {
  name: 'New',
  action() {
    ReactLayout.render(App, {
      content: <New />,
      nav: <Nav />
    });
  }
});

FlowRouter.route("/pending/:oid", {
  name: 'OutcomeView',
  action(params) {
    ReactLayout.render(App, {
      content: <OutcomeView oid={params.oid} />,
      nav: <Nav />
    });
  }
});

FlowRouter.route("/pending", {
  name: 'Pending',
  action() {
    ReactLayout.render(App, {
      content: <Pending />,
      nav: <Nav />
    });
  }
});

FlowRouter.route("/outcomesList", {
  name: 'OutcomesList',
  action() {
    ReactLayout.render(App, {
      content: <OutcomesList />,
      nav: <Nav />
    });
  }
});

FlowRouter.route("/leaders", {
  name: 'Leaderboard',
  action() {
    ReactLayout.render(App);
  }
});
