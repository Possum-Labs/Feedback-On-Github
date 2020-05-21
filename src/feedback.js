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
                    element.commentItems=[];
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

            Vue.component('comment-view',{
                props: ['comment'], 
                template: '<article class="comment">'+
                '<h4 class="comment-title">'+
				'		<span class="comment-meta">'+
				'			<a class="comment-author muted-link" v-bind:href="https://github.com/MonikaReddy-MSFT" data-bi-name="github-issue-comment-user">MonikaReddy-MSFT</a> commented '+
                '		<a class="comment-date muted-link" v-bind:href="https://github.com/MicrosoftDocs/azure-docs-cli/issues/1673#issuecomment-557373687" data-bi-name="github-issue-comment">'+
                '			<time v-bind:datetime="2019-11-22T03:34:17Z">on Nov 21, 2019</time>'+
                '		</a>'+
                '					</span>'+
                '				</h4>'+
                '</article>'
                });

            Vue.component('issue-view',{
                props: ['issue'], 
                template: '<div class="issue">'+
                '<button v-on:click="$emit("toggle-commnets", issue)">'+
                   '<span v-if="!issue.expand" class="iconify" data-icon="mdi:chevron-down-circle" data-inline="false"></span>'+
                   '<span v-if="issue.expand" class="iconify" data-icon="mdi:chevron-up-circle" data-inline="false"></span>'+
                '</button>'+
                '<label> {{ issue.title }} </label>'+
                '<a v-bind:href="issue.html_url" target="_blank">#{{issue.number}}</a> '+
                'created on {{issue.created_at}} by {{issue.user.login}}'+
                '<span class="comment-count" v-if="issue.comments > 0"><span class="iconify" data-icon="mdi:comment-outline" data-inline="false"></span> {{issue.comments}}</span>'+
                '<div v-if="issue.expand"> </div>'+
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
                        issue.expand=!issue.expand;
                    }
                }
            });
        });
    }
};