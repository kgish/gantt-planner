class CreateLinks < ActiveRecord::Migration[5.0]
  def change
    create_table :links do |t|
      t.belongs_to :source, class_name: 'Task'
      t.belongs_to :target, class_name: 'Task'
      t.integer :code
    end
  end
end
