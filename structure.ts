export = {
  "name": "game-off-2016",
  "files": [
    ".gitignore",
    "Procfile",
    "package.json",
    "elixir_buildpack.config",
    "mix.lock",
    "generate-repo-structure.py",
    "custom_compile",
    "README.md",
    "structure.ts",
    "phoenix_static_buildpack.config",
    "npm-debug.log.3127630061",
    "run-local.sh",
    "webpack.config.js",
    "tsconfig.json",
    "mix.exs"
  ],
  "folders": [
    {
      "name": "lib",
      "files": [
        "gameoff.ex"
      ],
      "folders": [
        {
          "name": "gameoff",
          "files": [
            "repo.ex",
            "endpoint.ex"
          ],
          "folders": [
            {
              "name": "world",
              "files": [
                "world_loader.ex",
                "repo_conversion.ex",
                "github_data_source.ex",
                "github_api_data_source.ex",
                "diamond_square.ex"
              ],
              "folders": []
            },
            {
              "name": "repository",
              "files": [
                "repository_supervisor.ex",
                "repository.ex"
              ],
              "folders": []
            }
          ]
        }
      ]
    },
    {
      "name": "web",
      "files": [
        "router.ex",
        "gettext.ex",
        "web.ex"
      ],
      "folders": [
        {
          "name": "models",
          "files": [
            "device.ex",
            "user.ex",
            "repository_device.ex",
            "attack.ex",
            "device_attack.ex",
            "user_device.ex",
            "repository.ex",
            "world_section.ex"
          ],
          "folders": []
        },
        {
          "name": "templates",
          "files": [],
          "folders": [
            {
              "name": "page",
              "files": [
                "game.html.eex",
                "landing.html.eex"
              ],
              "folders": []
            },
            {
              "name": "layout",
              "files": [
                "app.html.eex"
              ],
              "folders": []
            }
          ]
        },
        {
          "name": "auth",
          "files": [
            "guardian_serializer.ex",
            "auth_error_handler.ex"
          ],
          "folders": []
        },
        {
          "name": "controllers",
          "files": [
            "page_controller.ex",
            "auth_controller.ex"
          ],
          "folders": []
        },
        {
          "name": "channels",
          "files": [
            "repo_channel.ex",
            "world_channel.ex",
            "user_socket.ex"
          ],
          "folders": []
        },
        {
          "name": "views",
          "files": [
            "page_view.ex",
            "error_view.ex",
            "error_helpers.ex",
            "layout_view.ex"
          ],
          "folders": []
        },
        {
          "name": "static",
          "files": [],
          "folders": [
            {
              "name": "images",
              "files": [],
              "folders": [
                {
                  "name": "paper",
                  "files": [
                    "border-bottom.png",
                    "border-right.png",
                    "512x256.png",
                    "256x256.png"
                  ],
                  "folders": []
                }
              ]
            },
            {
              "name": "less",
              "files": [
                "style.less",
                "variables.less"
              ],
              "folders": [
                {
                  "name": "components",
                  "files": [
                    "terminal.less",
                    "screen.less"
                  ],
                  "folders": []
                }
              ]
            },
            {
              "name": "typings",
              "files": [
                "voronoi.d.ts",
                ".gitkeep",
                "jquery.terminal.d.ts"
              ],
              "folders": []
            },
            {
              "name": "ts",
              "files": [
                "game.ts",
                "app.ts"
              ],
              "folders": [
                {
                  "name": "api",
                  "files": [
                    "user.ts",
                    "device.ts",
                    "world.ts"
                  ],
                  "folders": [
                    {
                      "name": "transport",
                      "files": [
                        "server.ts"
                      ],
                      "folders": []
                    }
                  ]
                },
                {
                  "name": "components",
                  "files": [
                    "screen.ts"
                  ],
                  "folders": [
                    {
                      "name": "graphics",
                      "files": [
                        "polygon.ts",
                        "tooltip.ts",
                        "paper.ts",
                        "color.ts",
                        "map.ts"
                      ],
                      "folders": []
                    },
                    {
                      "name": "terminal",
                      "files": [
                        "loading-message.ts"
                      ],
                      "folders": []
                    }
                  ]
                },
                {
                  "name": "interpreters",
                  "files": [
                    "base-interpreter.ts",
                    "map-interpreter.ts",
                    "main-interpreter.ts"
                  ],
                  "folders": []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}