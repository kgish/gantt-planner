Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :links
      resources :tasks
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  mount_ember_app :frontend, to: "/"
end
