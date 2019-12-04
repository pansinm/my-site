---
title: Jenkins声明式pipeline
date: 2019-12-04
author: pansinm
---

> pipeline语法参考https://jenkins.io/doc/book/pipeline/syntax/

#### Jenkinsfile骨架

```groovy
pipeline {
    agent {
        // 构建的节点
    }

    environment {
        // 构建时注入的环境变量
    }

    parameters {
        // 参数化构建
    }

    triggers {
        // 构建触发器
    }

    // 构建阶段
    stages {
        stage('测试') {
            steps {
                // 测试阶段步骤
            }
        }

        stage('构建') {
            steps {
            }
        }
    }

    // 构建后回调，可以在success和failure中通知开发
    post {
        success {
        }

        failure {
        }
    }
}
```

### agent

agent，定义构建的节点，也可以在stage中指定。默认none，如果我们在jenkins上配置了一个mac节点，app在mac节点上构建，那么我们可以如下声明。

```groovy
agent {
    node {
        label: 'mac'
    }
}
```

#### environment 

可以在environment中注入构建时的环境变量。如我们构建时使用指定路径的nodejs。

```groovy
environment {
	PATH = "${PATH}:${HOME}/.nvm/versions/node/v8.11.1/bin"
}
```

除了可以在`environment`中声明环境变量外，还可以在groovy脚本中添加或修改。

```groovy
script {
    env.DOCKER_HOST='tcp://192.168.71.86:2376'
}
```

#### parameters

有时候我们需要参数化构建，如选择构建的环境，也可以通过Jenkinsfile定义。下面示例提供了两个选择框，可以选择部署的环境和部署类型。需要注意的是，选择框的第一个为默认值。

```groovy
parameters {
    choice(name: 'DEPLOY_ENV', choices: ['test', 'demo', 'production'], description: '选择部署环境');
    choice(name: 'DEPLOY_TYPE', choices: ['部署', '回滚'], description: '选择部署类型');
}
```

更多输入类型参考https://jenkins.io/doc/book/pipeline/syntax/#parameters

```groovy
parameters {
    string(name: 'PERSON', defaultValue: 'Mr Jenkins', description: 'Who should I say hello to?')

    text(name: 'BIOGRAPHY', defaultValue: '', description: 'Enter some information about the person')

    booleanParam(name: 'TOGGLE', defaultValue: true, description: 'Toggle this value')

    choice(name: 'CHOICE', choices: ['One', 'Two', 'Three'], description: 'Pick something')
    
    password(name: 'PASSWORD', defaultValue: 'SECRET', description: 'Enter a password')
    
    file(name: "FILE", description: "Choose a file to upload")
}
```

#### triggers

当然，也可以在Jenkinsfile上定义任务的触发器，内部提供了`cron`,`pollSCM`和`upstream`三种类型的触发器。

```groovy
triggers {
	cron('H */4 * * 1-5')
}
```

除了内置触发器外，许多插件也提供了触发器，比如 Generic Webhook Trigger 

```groovy
triggers {
    GenericTrigger(
        genericVariables: [					// 从参数中取值
            [key: 'ref', value: '$.ref']
        ],

        causeString: 'Triggered on $ref',

        token: 'cassec_imservice_ci',	// 只有url中的token=cassec_imservice_ci才会触发

        printContributedVariables: true,
        printPostContent: true,

        regexpFilterText: '$ref',	
        regexpFilterExpression: 'refs/heads/' + BRANCH_NAME	// 当ref为当前分支时才构建
        // 注： 只在多分支流水线项目中才包含BRANCH_NAME字段
    )
}
```

#### stages

stages中的stage会显示在Jenkins任务主页中的Stage View中。每个stage可以有很多个steps，我们可以执行构建命令。

```groovy
stage('打印环境变量') {
    steps {
        sh "printenv"
    }
}
```

如果你不知道支持哪些流水线脚本，可以在任务主页中点击【Pipeline Syntax】进入页面，选择示例步骤，生成流水线脚本。

当然，可以在steps中使用script支持groovy脚本。比如以下脚本，在不同构建环境下设置不同的环境变量。

```groovy
stage('设置network') {
    steps {
        script {
            if (env.DEPLOY_ENV == 'test') {
                env.NETWORK='host'
            } else {
                env.NETWORK=''
            }
        }
        sh 'printenv'
    }
}
```

#### post

构建完成功或失败后，会触发后置处理

```groovy
post {
    success {
		sh 'printenv'
    }

    failure {
		echo 'build error'
    }
}
```

#### 字符串

groovy有多种字符串定义的方式，只有双引号字符串可以插入参数。

```groovy
'hello, world'

"hello, ${PARAMS}"

'''
  hello,
  world!
'''

"""
  hello,
  ${PARAMS}
"""
```

#### 钉钉群通知

可以在

1. 声明钉钉机器人url

    ```groovy
      environment {
        DINGDING_ROBOT_URL = 'https://oapi.dingtalk.com/robot/send?access_token=fdf9070b17385fa22ab36fc655809d5e38163db7859f0'
      }
    ```

2. 将通知信息拼接成钉钉支持的格式，使用curl发送，参考https://open-doc.dingtalk.com/docs/doc.htm?treeId=257&articleId=105735&docType=1

    ```groovy
    post {
        success {
            script {
                def markdown = """
    ####  "${env.JOB_NAME} 部署成功 [${env.BUILD_NUMBER}]"
                """
                def json = """
                  {
                      "msgtype": "markdown",
                      "markdown": {
                          "title": "杭州天气",
                          "text": "${markdown}"
                      },
                  }
                """
                sh "curl -H 'Content-Type:application/json' -X POST --data '${json}' ${DINGDING_ROBOT_URL}"
            }
        }
    }

    ```

    最好能够将上面的json拼接抽象成函数。

    ```groovy
    pipeline {
        // ...
        post {
            success {
                script {
                    def json = buildJSON('构建成功', '#### 构建成功...')
                    sh "curl -H 'Content-Type:application/json' -X POST --data '${json}' ${DINGDING_ROBOT_URL}"
                }
            }
        }
    }

    def buildJSON(title, markdown) {
      return """
    {
      "msgtype": "markdown",
      "markdown":{
        "title": "${title}",
        "text":"${markdown}"
      }
    }
      """
    }
    ```

