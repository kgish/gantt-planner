class CreateTasks < ActiveRecord::Migration[5.0]
  def change
    create_table :tasks do |t|
      t.string :text
      t.date :start_date
      t.integer :duration
      t.float :progress
      t.integer :sortorder
      t.belongs_to :parent, class_name: 'Task'
      t.belongs_to :topmost, class_name: 'Task'
    end
  end
end
