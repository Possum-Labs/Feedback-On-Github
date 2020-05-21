var feedbackOnGithub = {};
feedbackOnGithub.init = function(config){
    if($("feedback")){
        $.ajax({
            url: "https://feedback-on-github.possumlabs.com/src/feedback.html"
        }).then(function(data) {
            $("feedback").html(data);

            //configure me
            var user = config.username;
            var repo = config.repo;

            //change at your own risk
            var project = user+"/"+repo;
            var githubProjectUrl = "https://github.com/" + project;
            var issuesNew = "/issues/new?";

            var pathname = "Reference Path:" + window.parent.location.pathname

            function pageQueuryBuilder() {
                return "title=&amp;body=%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20Details%0A%0A%E2%9A%A0%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20" +
                    project + "%20%E2%9E%9F%20GitHub%20issue%20linking.*%0A%0A*%20Path%3A%20" + pathname
            }

            function projectQueuryBuilder() {
                return "title=&amp;body=%0A%0A%5BEnter%20feedback%20here%5D%0A%0A%0A---%0A%23%23%23%23%20Document%20Details%0A%0A%E2%9A%A0%20*Do%20not%20edit%20this%20section.%20It%20is%20required%20for%20" +
                    project + "%20%E2%9E%9F%20GitHub%20issue%20linking.*%0A%0A*%20Source%3A%20" + pathname
            }

            var dataModel = {
                projectFeedbackUrl: githubProjectUrl + issuesNew + projectQueuryBuilder(),
                pageFeedbackUrl:githubProjectUrl + issuesNew + pageQueuryBuilder(),
                githubFeedbackUrl:githubProjectUrl + "/issues/new/choose",
                openCount: 0,
                closedCount:0,
                viewOpen: true,
                viewClosed: false,
                openIssues:[],
                closedIssues:[]
            };

            $.ajax({
                url: "https://api.github.com/search/issues?"+
                "q=%22"+"Path%3A%20" + pathname +
                "%22%20type%3Aissue%20in%3Abody%20repo%3A"+user+"%2F"+repo+
                "&sort=created&order=desc"
            }).then(function(data) {
                data.items.forEach(element => {
                    if(element.state === "closed"){
                        dataModel.closedCount++;
                        dataModel.closedIssues.push(element);
                    }
                    if(element.state === "open"){
                        dataModel.openCount++;
                        dataModel.openIssues.push(element);
                    }
                });
            });

            Vue.component('issue-view',{
                props: ['issue'], 
                template: '<div>'+
                '<button v-on:click="expandIssueClick(issue)"></button>'+
                '<label> {{ issue.title }} </label>'+
                '<a v-bind:href="issue.html_url" target="_blank">#{{issue.number}}</a> '+
                'created on {{issue.created_at}} by {{issue.user.login}}'+
                'comments {{issue.comments}}'+
                '<div v-if="issue.expand"> <div>'+
                '</div>'
                });

            var app = new Vue({
                el: '#feedback-app',
                data: dataModel,
                methods:{
                    viewOpenClick: function() {
                        dataModel.viewOpen = true;
                        dataModel.viewClosed = false;
                    },
                    viewClosedClick: function() {
                        dataModel.viewOpen = false;
                        dataModel.viewClosed = true;
                    },
                    expandIssueClick: function(issue) {
                        issue.expand=true;
                    }
                }
            });
        });
    }
};