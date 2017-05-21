class CreateProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :projects do |t|
      t.integer :project_id
      t.string :text
      t.date :start_date
      t.integer :duration
      t.float :progress
      t.integer :sortorder
    end
  end
end
